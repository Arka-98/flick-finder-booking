import { Injectable } from '@nestjs/common';
import { EventsEmitterService } from '../events-emitter/events-emitter.service';
import { concat, defer } from 'rxjs';

@Injectable()
export class StreamerService {
  constructor(private readonly eventsEmitterService: EventsEmitterService) {}

  emitBookingEventsById(bookingId: string) {
    return concat(
      this.eventsEmitterService.getBookingEventsHistoryById$(bookingId),
      defer(() =>
        this.eventsEmitterService.getLiveBookingEventsById$(bookingId),
      ),
    );
  }
}
