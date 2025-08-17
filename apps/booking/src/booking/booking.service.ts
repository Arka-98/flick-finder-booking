import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { Queue } from 'bullmq';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '@app/common/consumers/user/entities/user.entity';
import { Showtime } from '@app/common/consumers/showtime/entities/showtime.entity';
import { BookingQueueJobNameEnum } from '@app/common/enums/booking-queue-job-name.enum';
import { Booking } from '@app/common/entities/booking.entity';
import { BookingStatusEnum } from '@app/common/enums/booking-status.enum';
import { BookingEvent } from '@app/common/entities/booking-event.entity';
import { BookingEventTypeEnum } from '@app/common/enums/booking-event-type.enum';
import { BookingJobInterface } from '@app/common/interfaces/booking-job.interface';
import { KafkaService, TOPICS } from '@flick-finder/common';
import { ShowtimeSeat } from '@app/common/consumers/showtime/entities/showtime-seat.entity';
import { ShowtimeSeatStatusEnum } from '@app/common/enums/showtime-seat-status.enum';

@Injectable()
export class BookingService {
  constructor(
    private readonly kafkaService: KafkaService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingEvent)
    private readonly bookingEventRepository: Repository<BookingEvent>,
    @InjectRepository(ShowtimeSeat)
    private readonly showtimeSeatRepository: Repository<ShowtimeSeat>,
    @InjectQueue(QueueEnum.BOOKING)
    private readonly bookingQueue: Queue<BookingJobInterface>,
  ) {}

  async create({ userId, showtimeId, seatIds }: CreateBookingDto) {
    const [user, showtime] = await Promise.all([
      this.userRepository.findOneBy({ id: userId }),
      this.showtimeRepository.findOne({
        where: { id: showtimeId },
        relations: { movie: true },
      }),
    ]);

    if (!user || !showtime) {
      throw new UnprocessableEntityException('User or showtime not found');
    }

    if (
      showtime.showtime.getTime() + showtime.movie.duration * 60 * 60 * 1000 <
      Date.now()
    ) {
      throw new UnprocessableEntityException('Showtime is over');
    }

    const showtimeSeats = await this.showtimeSeatRepository
      .createQueryBuilder()
      .where('showtime_id = :showtimeId', { showtimeId })
      .andWhere('seat_id IN (:...seatIds)', { seatIds })
      .andWhere('status = :status', {
        status: ShowtimeSeatStatusEnum.AVAILABLE,
      })
      .getMany();

    if (showtimeSeats.length !== seatIds.length) {
      throw new UnprocessableEntityException('Some seats are not available');
    }

    const booking = await this.bookingRepository
      .createQueryBuilder()
      .insert()
      .values({
        user: { id: userId },
        showtime: { id: showtimeId },
        initialSeats: seatIds,
        status: BookingStatusEnum.PROCESSING,
      })
      .returning('*')
      .execute();

    await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
      key: booking.raw[0].id,
      value: {
        bookingId: booking.raw[0].id,
        eventType: BookingEventTypeEnum.BOOK_PENDING,
        createdAt: new Date(),
      },
    });

    const { id } = await this.bookingQueue.add(BookingQueueJobNameEnum.BOOK, {
      bookingId: booking.raw[0].id,
      userId,
      showtimeId,
      seatIds,
    });

    await this.bookingRepository.update(
      { id: booking.raw[0].id },
      { jobId: id },
    );

    return { bookingId: booking.raw[0].id, jobId: id };
  }
}
