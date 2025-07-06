import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { interval, map, Observable, Subject } from 'rxjs';

@Controller('events')
export class AppController {
  private readonly subject = new Subject<MessageEvent>();

  constructor(private readonly appService: AppService) {}

  @Sse()
  ping(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map((_, index) => ({ data: { hello: `world ${index}` } })),
    );
  }
}
