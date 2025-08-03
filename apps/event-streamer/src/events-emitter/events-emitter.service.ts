import { BookingKafkaEventDto } from '@app/common/dto/booking-kafka-event.dto';
import { RedisService } from '@app/common/modules/redis/redis.service';
import { Injectable, MessageEvent } from '@nestjs/common';
import { from, map, mergeMap, Observable, Subject } from 'rxjs';

@Injectable()
export class EventsEmitterService {
  private readonly liveBookingEventsSubjectMap = new Map<
    string,
    Subject<MessageEvent>
  >();

  constructor(private readonly redisService: RedisService) {}

  getLiveBookingEventsById$(bookingId: string) {
    return (
      this.liveBookingEventsSubjectMap.get(bookingId)?.asObservable() ||
      new Observable()
    );
  }

  getBookingEventsHistoryById$(bookingId: string) {
    return from(
      this.redisService.readAllEntriesFromStream<BookingKafkaEventDto>(
        bookingId,
      ),
    ).pipe(
      mergeMap((entries) => from(entries)),
      map<BookingKafkaEventDto, MessageEvent>((entry) => ({ data: entry })),
    );
  }

  emitLiveBookingEventsById(bookingId: string, event: MessageEvent) {
    if (!this.liveBookingEventsSubjectMap.has(bookingId)) {
      this.liveBookingEventsSubjectMap.set(bookingId, new Subject());
    }

    this.liveBookingEventsSubjectMap.get(bookingId)?.next(event);
  }
}
