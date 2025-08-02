import { BookingKafkaEventDto } from '@app/common/dto/booking-kafka-event.dto';
import { Injectable } from '@nestjs/common';
import { EventsEmitterService } from '../events-emitter/events-emitter.service';

@Injectable()
export class EventsService {
  constructor(private readonly eventsEmitterService: EventsEmitterService) {}

  emitLiveBookingEvents(bookingEvent: BookingKafkaEventDto) {
    return this.eventsEmitterService.emitLiveBookingEventsById(
      bookingEvent.bookingId,
      { data: bookingEvent },
    );
  }
}
