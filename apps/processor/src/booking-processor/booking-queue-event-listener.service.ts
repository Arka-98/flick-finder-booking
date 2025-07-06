import { BookingEventTypeEnum } from '@app/common/enums/booking-event-type.enum';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { KafkaService, TOPICS } from '@flick-finder/common';
import {
  OnQueueEvent,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';

@QueueEventsListener(QueueEnum.BOOKING)
export class BookingQueueEventListenerService extends QueueEventsHost {
  private readonly loggerService = new Logger(
    BookingQueueEventListenerService.name,
  );

  constructor(private readonly kafkaService: KafkaService) {
    super();
  }

  @OnQueueEvent('error')
  async onQueueError(error: Error & { bookingId: string }) {
    this.loggerService.error(error.message || error);

    await this.kafkaService.emit(TOPICS.BOOKING_EVENT.CREATED, {
      key: error.bookingId,
      value: {
        bookingId: error.bookingId,
        eventType: BookingEventTypeEnum.BOOK_FAILED,
        createdAt: new Date(),
      },
    });
  }
}
