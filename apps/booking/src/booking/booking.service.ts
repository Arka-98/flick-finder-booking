import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '@app/common/consumers/user/entities/user.entity';
import { Showtime } from '@app/common/consumers/showtime/entities/showtime.entity';
import { Booking } from '@app/common/entities/booking.entity';
import { BookingStatusEnum } from '@app/common/enums/booking-status.enum';
import { BookingEventTypeEnum } from '@app/common/enums/booking-event-type.enum';
import { KafkaService, StripeService, TOPICS } from '@flick-finder/common';
import { ShowtimeSeat } from '@app/common/consumers/showtime/entities/showtime-seat.entity';
import { ShowtimeSeatStatusEnum } from '@app/common/enums/showtime-seat-status.enum';
import { Seat } from '@app/common/consumers/seat/entities/seat.entity';
import { SeatPricing } from '@app/common/consumers/seat-pricing/entities/seat-pricing.entity';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { Queue } from 'bullmq';
import { BookingQueueJobNameEnum } from '@app/common/enums/booking-queue-job-name.enum';
import { StripeEventLog } from '@app/common/entities/stripe-event-log.entity';

/**
 * Service responsible for handling booking operations, including creating bookings,
 * processing payments, and updating showtime seats.
 * 4 entities are involved during a booking process: `Booking`, `BookingEvent`, `ShowtimeSeat`, `SeatReservation`
 * - Booking: Represents a user's booking for a specific showtime, including the selected seats and booking status.
 * - BookingEvent: Logs events related to the booking process, such as initiation, payment status, and completion.
 * - ShowtimeSeat: Represents the availability of seats for a specific showtime and seat type.
 * - SeatReservation: Associates a seat with a specific booking, indicating that the seat has been reserved for the booking.
 */
@Injectable()
export class BookingService {
  private readonly loggerService = new Logger(BookingService.name);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly dataSource: DataSource,
    private readonly stripeService: StripeService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(ShowtimeSeat)
    private readonly showtimeSeatRepository: Repository<ShowtimeSeat>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
    @InjectRepository(SeatPricing)
    private readonly seatPricingRepository: Repository<SeatPricing>,
    @InjectQueue(QueueEnum.BOOKING)
    private readonly bookingQueue: Queue,
  ) {}

  async create({ showtimeId, seatIds }: CreateBookingDto, userId: string) {
    const [user, showtime] = await Promise.all([
      this.userRepository.findOneBy({ id: userId }),
      this.showtimeRepository.findOne({
        where: { id: showtimeId },
        relations: { movie: true },
      }),
    ]);

    if (!user || !showtime) {
      throw new BadRequestException('User or showtime not found');
    }

    if (
      showtime.showtime.getTime() + showtime.movie.duration * 60 * 60 * 1000 <
      Date.now()
    ) {
      throw new BadRequestException('Showtime is over');
    }

    const booking = await this.bookingRepository
      .createQueryBuilder()
      .insert()
      .values({
        user: { id: userId },
        showtime: { id: showtimeId },
        seatIdsSnapshot: seatIds,
        status: BookingStatusEnum.PROCESSING,
      })
      .returning('*')
      .execute();
    const bookingRecord = booking.raw[0];

    await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
      key: bookingRecord.id,
      value: {
        bookingId: bookingRecord.id,
        eventType: BookingEventTypeEnum.BOOK_INIT,
        createdAt: bookingRecord.createdAt,
      },
    });
    await this.lockSeatsForShowtimeAndCreateBooking(
      showtimeId,
      seatIds,
      bookingRecord,
    );

    if (!bookingRecord) {
      throw new InternalServerErrorException('Failed to create booking');
    }

    const seats = await this.seatRepository
      .createQueryBuilder()
      .where('id IN (:...seatIds)', { seatIds })
      .getMany();
    const seatPricings = await this.seatPricingRepository
      .createQueryBuilder()
      .where('showtime_id = :showtimeId', { showtimeId })
      .andWhere('seat_type_id IN (:...seatTypeIds)', {
        seatTypeIds: seats.map((seat) => seat.seatType),
      })
      .getMany();
    const frontendAppUrl = this.configService.get('FRONTEND_APP_URL');
    const metadata = { bookingId: bookingRecord.id };
    const session = await this.stripeService.createCheckoutSession(
      seatPricings.map(({ stripePriceId }) => ({ price: stripePriceId })),
      `${frontendAppUrl}/checkout_success?session_id={CHECKOUT_SESSION_ID}`,
      `${frontendAppUrl}/checkout_cancelled`,
      metadata,
      { metadata },
    );

    return { redirectUrl: session.url };
  }

  async handleStripeWebhook(payload: Buffer, stripeSignature: string) {
    let queryRunner: QueryRunner;

    try {
      const event = await this.stripeService.verifyAndConstructEvent(
        payload,
        stripeSignature,
        this.configService.get('STRIPE_WEBHOOK_SECRET'),
      );

      this.loggerService.debug(
        `Received Stripe event ${event.type} with ID: ${event.id}`,
      );

      queryRunner = this.dataSource.createQueryRunner();

      /**
       * Log the received stripe event in postgres in a transaction
       * to ensure idempotency when processing the event in the queue later
       */
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.insert(StripeEventLog, {
        stripeEventId: event.id,
        stripeEventType: event.type,
        stripeObjectId: event.data.object['id'],
      });
      await queryRunner.commitTransaction();
      await this.bookingQueue.add(BookingQueueJobNameEnum.STRIPE_EVENT, event);
    } catch (error) {
      await queryRunner?.rollbackTransaction();

      this.loggerService.warn(
        `Error handling Stripe webhook event - ${error.raw || error.message}`,
      );

      if (error instanceof Stripe.errors.StripeSignatureVerificationError) {
        throw new BadRequestException(
          `Invalid Stripe webhook signature. Error: ${error.message}`,
        );
      }
    } finally {
      queryRunner?.release();
    }
  }

  private async lockSeatsForShowtimeAndCreateBooking(
    showtimeId: string,
    seatIds: string[],
    booking: Booking,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const showtimeSeats = await queryRunner.manager
        .getRepository(ShowtimeSeat)
        .createQueryBuilder()
        .where('showtime_id = :showtimeId', { showtimeId })
        .andWhere('seat_id IN (:...seatIds)', { seatIds })
        .andWhere('status = :status', {
          status: ShowtimeSeatStatusEnum.AVAILABLE,
        })
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .getMany();

      if (showtimeSeats.length !== seatIds.length) {
        throw new UnprocessableEntityException(
          'Requested seat IDs are not available',
        );
      }

      await queryRunner.manager
        .getRepository(ShowtimeSeat)
        .createQueryBuilder()
        .update()
        .set({ status: ShowtimeSeatStatusEnum.PENDING })
        .where('id IN (:...ids)', { ids: showtimeSeats.map(({ id }) => id) })
        .execute();
      await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
        key: booking.id,
        value: {
          bookingId: booking.id,
          eventType: BookingEventTypeEnum.SEAT_RESERVATION_INIT,
          createdAt: new Date(),
        },
      });
      await queryRunner.commitTransaction();
      await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
        key: booking.id,
        value: {
          bookingId: booking.id,
          eventType: BookingEventTypeEnum.BOOK_PENDING,
          createdAt: new Date(),
        },
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
        key: booking.id,
        value: {
          bookingId: booking.id,
          eventType: BookingEventTypeEnum.BOOK_FAILED,
          message: error.message,
          createdAt: new Date(),
        },
      });

      this.loggerService.error(
        `Error occurred while processing booking: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
