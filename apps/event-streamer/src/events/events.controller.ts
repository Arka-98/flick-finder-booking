import { BookingKafkaEventDto } from '@app/common/dto/booking-kafka-event.dto';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';
import { BOOKING_EVENTS_CHANNEL } from '@app/common/constants';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @EventPattern(BOOKING_EVENTS_CHANNEL)
  async handleBookingEventCreated(
    @Payload() bookingEvent: BookingKafkaEventDto,
  ) {
    return this.eventsService.emitLiveBookingEvents(bookingEvent);
  }
}
