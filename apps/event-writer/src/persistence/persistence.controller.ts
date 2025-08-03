import { Controller } from '@nestjs/common';
import { PersistenceService } from './persistence.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Public, TOPICS } from '@flick-finder/common';
import { BookingKafkaEventDto } from '@app/common/dto/booking-kafka-event.dto';

@Public()
@Controller('consumers')
export class PersistenceController {
  constructor(private readonly persistenceService: PersistenceService) {}

  @EventPattern(TOPICS.BOOKING_EVENT.CREATED)
  async handleBookingEventCreated(
    @Payload() bookingEvent: BookingKafkaEventDto,
  ) {
    return this.persistenceService.persistBookingEventsToRedis(bookingEvent);
  }
}
