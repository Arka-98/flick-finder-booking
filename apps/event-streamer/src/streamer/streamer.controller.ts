import { Controller, MessageEvent, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StreamerService } from './streamer.service';

@Controller('stream')
export class StreamerController {
  constructor(private readonly streamerService: StreamerService) {}

  @Sse('booking/:bookingId')
  ping(@Param('bookingId') bookingId: string): Observable<MessageEvent> {
    return this.streamerService.emitBookingEventsById(bookingId);
  }
}
