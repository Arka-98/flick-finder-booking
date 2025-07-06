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
import { RedisService } from '@app/common/modules/redis/redis.service';
import { BookingJobInterface } from '@app/common/interfaces/booking-job.interface';

@Injectable()
export class BookingService {
  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(BookingEvent)
    private readonly bookingEventRepository: Repository<BookingEvent>,
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

    // 1. Verify whether showtimes.showtime + movie duration is greater than current time
    if (
      showtime.showtime.getTime() + showtime.movie.duration * 60 * 60 * 1000 <
      Date.now()
    ) {
      throw new UnprocessableEntityException('Showtime is over');
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

    // 2. Lock the seat ids for the specified showtime in showtime_seats table (should be done in a txc, but here or in job queue processor?)

    // 3. Check whether requested seat ids are available in showtime_seats table

    // 4. Update booking entry

    // 5. Add job to booking queue to process payment, reserve seats in showtime_seats table & send notification (no need to wait for result)

    const { id } = await this.bookingQueue.add(BookingQueueJobNameEnum.BOOK, {
      bookingId: booking.raw.id,
      userId,
      showtimeId,
      seatIds,
    });

    await this.bookingRepository.update({ id: booking.raw.id }, { jobId: id });
    await this.redisService.pushToQueue(QueueEnum.BOOKING, [
      {
        bookingId: booking.raw.id,
        eventType: BookingEventTypeEnum.BOOK_INIT,
        createdAt: new Date(),
      },
    ]);

    return { bookingId: booking.raw.id, jobId: id };
  }
}
