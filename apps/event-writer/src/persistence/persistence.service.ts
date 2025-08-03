import {
  BOOKING_EVENTS_CHANNEL,
  REDIS_SERVICE_TOKEN,
} from '@app/common/constants';
import { BookingKafkaEventDto } from '@app/common/dto/booking-kafka-event.dto';
import { BookingEvent } from '@app/common/entities/booking-event.entity';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { RedisService } from '@app/common/modules/redis/redis.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PersistenceService {
  private readonly loggerService = new Logger(PersistenceService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(BookingEvent)
    private readonly bookingEventRepository: Repository<BookingEvent>,
    @Inject(REDIS_SERVICE_TOKEN) private readonly redisClientProxy: ClientRedis,
  ) {}

  @Cron('*/30 * * * * *')
  async handleBatchInsertToDb() {
    await this.batchInsertToDb();
  }

  async persistBookingEventsToRedis(bookingEvent: BookingKafkaEventDto) {
    await Promise.all([
      this.redisService.pushToQueue(QueueEnum.BOOKING, [bookingEvent]),
      this.redisService.addEntryToStream(
        bookingEvent.bookingId,
        'data',
        bookingEvent,
      ),
    ]);

    return this.redisClientProxy.emit<string, BookingKafkaEventDto>(
      BOOKING_EVENTS_CHANNEL,
      bookingEvent,
    );
  }

  async batchInsertToDb() {
    this.loggerService.log('Initiated booking events batch insert to DB');

    const lock = await this.redisService.redlock.acquire(
      [`locks:${QueueEnum.BOOKING_INFLIGHT}`],
      1000,
    );

    try {
      await this.redisService.moveAllToAnotherQueue(
        QueueEnum.BOOKING,
        QueueEnum.BOOKING_INFLIGHT,
      );

      const bookingEvents =
        await this.redisService.getAllFromQueue<BookingKafkaEventDto>(
          QueueEnum.BOOKING_INFLIGHT,
        );

      if (bookingEvents.length) {
        await this.bookingEventRepository.insert(
          bookingEvents.map(({ bookingId, eventType, message, createdAt }) => ({
            bookingId: { id: bookingId },
            eventType,
            createdAt: createdAt.toString(),
            ...(message && { message }),
          })),
        );

        this.loggerService.log('Finished booking events batch insert to DB');
      } else {
        this.loggerService.log('No booking events found');
      }

      await this.redisService.deleteQueue(QueueEnum.BOOKING_INFLIGHT);
    } catch (error) {
      this.loggerService.error(error.message || error);
    } finally {
      await lock.release();
    }
  }
}
