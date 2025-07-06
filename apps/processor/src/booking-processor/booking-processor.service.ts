import { ShowtimeSeat } from '@app/common/consumers/showtime/entities/showtime-seat.entity';
import { BookingEventTypeEnum } from '@app/common/enums/booking-event-type.enum';
import { BookingQueueJobNameEnum } from '@app/common/enums/booking-queue-job-name.enum';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { BookingJobInterface } from '@app/common/interfaces/booking-job.interface';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { UnprocessableEntityException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Job } from 'bullmq';
import { Booking } from '@app/common/entities/booking.entity';
import { BookingStatusEnum } from '@app/common/enums/booking-status.enum';
import { KafkaService, TOPICS } from '@flick-finder/common';
import { SeatReservation } from '@apps/booking/src/seat-reservation/entities/seat-reservation.entity';

@Processor(QueueEnum.BOOKING, { concurrency: 100 })
export class BookingProcessorService extends WorkerHost {
  constructor(
    private readonly dataSource: DataSource,
    private readonly kafkaService: KafkaService,
  ) {
    super();
  }

  public async process(
    job: Job<BookingJobInterface, void, BookingQueueJobNameEnum>,
  ) {
    switch (job.name) {
      case BookingQueueJobNameEnum.BOOK: {
        const { bookingId, showtimeId, seatIds } = job.data;

        await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
          key: bookingId,
          value: {
            bookingId,
            eventType: BookingEventTypeEnum.BOOK_PENDING,
            createdAt: new Date(),
          },
        });
        await this.reserveSeatsForShowtime(bookingId, showtimeId, seatIds);

        // @todo process payment

        await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
          key: bookingId,
          value: {
            bookingId,
            eventType: BookingEventTypeEnum.BOOK_PENDING,
            createdAt: new Date(),
          },
        });

        break;
      }
    }
  }

  private async reserveSeatsForShowtime(
    bookingId: string,
    showtimeId: string,
    seatIds: string[],
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const showtimeSeats = await queryRunner.manager
        .createQueryBuilder()
        .select('id')
        .from(ShowtimeSeat, 'showtime_seats')
        .where('showtime_id = :showtimeId', { showtimeId })
        .andWhere('seat_id IN (:...seatIds)', { seatIds })
        .setLock('pessimistic_write')
        .setOnLocked('skip_locked')
        .getMany();

      if (showtimeSeats.length !== seatIds.length) {
        throw new UnprocessableEntityException(
          'Requested seat IDs are not available',
        );
      }

      await queryRunner.manager.insert(
        SeatReservation,
        seatIds.map((seatId) => ({
          booking: { id: bookingId },
          seat: { id: seatId },
        })),
      );
      await queryRunner.manager.update(
        Booking,
        { id: bookingId },
        { status: BookingStatusEnum.COMPLETED },
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw { ...error, bookingId };
    } finally {
      await queryRunner.release();
    }
  }
}
