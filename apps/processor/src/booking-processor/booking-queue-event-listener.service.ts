import { BookingKafkaEventDto } from '@app/common/dto/booking-kafka-event.dto';
import { Booking } from '@app/common/entities/booking.entity';
import { BookingEventTypeEnum } from '@app/common/enums/booking-event-type.enum';
import { BookingStatusEnum } from '@app/common/enums/booking-status.enum';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { KafkaService, TOPICS } from '@flick-finder/common';
import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@QueueEventsListener(QueueEnum.BOOKING)
export class BookingQueueEventListenerService extends QueueEventsHost {
  private readonly loggerService = new Logger(
    BookingQueueEventListenerService.name,
  );

  constructor(
    private readonly kafkaService: KafkaService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {
    super();
  }

  @OnQueueEvent('failed')
  async onQueueError(error: {
    failedReason: string;
    jobId: string;
    prev?: string;
  }) {
    this.loggerService.warn(error.failedReason);

    const { id } = await this.bookingRepository.findOne({
      select: ['id'],
      where: { jobId: error.jobId },
    });

    await Promise.all([
      this.bookingRepository.update(id, {
        status: BookingStatusEnum.FAILED,
      }),
      this.kafkaService.emit<BookingKafkaEventDto>(
        TOPICS.BOOKING_EVENT.CREATED,
        {
          key: id,
          value: {
            bookingId: id,
            eventType: BookingEventTypeEnum.BOOK_FAILED,
            message: error.failedReason,
            createdAt: new Date(),
          },
        },
      ),
    ]);
  }
}
