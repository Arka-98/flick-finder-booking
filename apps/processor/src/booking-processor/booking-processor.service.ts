import { ShowtimeSeat } from '@app/common/consumers/showtime/entities/showtime-seat.entity';
import { BookingEventTypeEnum } from '@app/common/enums/booking-event-type.enum';
import { BookingQueueJobNameEnum } from '@app/common/enums/booking-queue-job-name.enum';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { BookingJobInterface } from '@app/common/interfaces/booking-job.interface';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Job } from 'bullmq';
import { Booking } from '@app/common/entities/booking.entity';
import { BookingStatusEnum } from '@app/common/enums/booking-status.enum';
import { KafkaService, StripeService, TOPICS } from '@flick-finder/common';
import { SeatReservation } from '@apps/booking/src/seat-reservation/entities/seat-reservation.entity';
import { ShowtimeSeatStatusEnum } from '@app/common/enums/showtime-seat-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';

@Processor(QueueEnum.BOOKING, { concurrency: 100 })
export class BookingProcessorService extends WorkerHost {
  private readonly loggerService = new Logger(BookingProcessorService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly kafkaService: KafkaService,
    private readonly stripeService: StripeService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {
    super();
  }

  public async process(
    job: Job<BookingJobInterface, void, BookingQueueJobNameEnum>,
  ) {
    const { stripeEvent } = job.data;

    switch (stripeEvent.type) {
      case 'payment_intent.created':
      case 'payment_intent.processing':
      case 'payment_intent.payment_failed':
      case 'payment_intent.succeeded': {
        const bookingId = stripeEvent.data.object.metadata.bookingId;

        await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
          key: bookingId,
          value: {
            bookingId,
            eventType: this.getPaymentEventTypeFromStripeEvent(
              stripeEvent.type,
            ),
            createdAt: new Date(stripeEvent.data.object.created * 1000),
          },
        });

        break;
      }

      case 'checkout.session.completed':
      case 'checkout.session.expired':
      case 'checkout.session.async_payment_succeeded': {
        await this.fulfillBookingCheckout(stripeEvent.data.object.id);

        break;
      }

      default: {
        this.loggerService.warn(
          `Unhandled Stripe event type: ${stripeEvent.type}`,
        );
      }
    }
  }

  private async fulfillBookingCheckout(sessionId: string) {
    const session = await this.stripeService.retrieveCheckoutSession(sessionId);
    const bookingRecord: Pick<Booking, 'id' | 'seatIdsSnapshot'> =
      await this.bookingRepository.findOne({
        select: ['id', 'seatIdsSnapshot'],
        where: { id: session.metadata.bookingId },
      });

    const queryRunner = this.dataSource.createQueryRunner();
    const paymentFailed = session.payment_status === 'unpaid';

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!paymentFailed) {
        await queryRunner.manager.insert(
          SeatReservation,
          bookingRecord.seatIdsSnapshot.map((seatId) => ({
            booking: { id: bookingRecord.id },
            seat: { id: seatId },
          })),
        );
      }

      await Promise.all([
        queryRunner.manager.update(
          Booking,
          { id: bookingRecord.id },
          {
            status: paymentFailed
              ? BookingStatusEnum.FAILED
              : BookingStatusEnum.COMPLETED,
            stripeCheckoutSessionId: session.id,
          },
        ),
        queryRunner.manager
          .getRepository(ShowtimeSeat)
          .createQueryBuilder()
          .update()
          .set({
            status: paymentFailed
              ? ShowtimeSeatStatusEnum.AVAILABLE
              : ShowtimeSeatStatusEnum.BOOKED,
          })
          .where('seat_id IN (:...seatIds)', {
            seatIds: bookingRecord.seatIdsSnapshot,
          })
          .execute()
          .then(() =>
            this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
              key: bookingRecord.id,
              value: {
                bookingId: bookingRecord.id,
                eventType: paymentFailed
                  ? BookingEventTypeEnum.SEAT_RESERVATION_FAILED
                  : BookingEventTypeEnum.SEAT_RESERVATION_SUCCESS,
                ...(paymentFailed && { message: 'Payment was not successful' }),
                createdAt: new Date(session.created * 1000),
              },
            }),
          ),
      ]);
      await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
        key: bookingRecord.id,
        value: {
          bookingId: bookingRecord.id,
          eventType: paymentFailed
            ? BookingEventTypeEnum.BOOK_FAILED
            : BookingEventTypeEnum.BOOK_SUCCESS,
          ...(paymentFailed && { message: 'Payment was not successful' }),
          createdAt: new Date(),
        },
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private getPaymentEventTypeFromStripeEvent(event: Stripe.Event.Type) {
    switch (event) {
      case 'payment_intent.created':
        return BookingEventTypeEnum.PAYMENT_INIT;

      case 'payment_intent.processing':
        return BookingEventTypeEnum.PAYMENT_PROCESSING;

      case 'payment_intent.payment_failed':
        return BookingEventTypeEnum.PAYMENT_FAILED;

      case 'payment_intent.succeeded':
        return BookingEventTypeEnum.PAYMENT_SUCCESS;
    }
  }
}
