import { Controller, Get } from '@nestjs/common';
import { EventWriterService } from './event-writer.service';

@Controller()
export class EventWriterController {
  constructor(private readonly eventWriterService: EventWriterService) {}

  @Get()
  getHello(): string {
    return this.eventWriterService.getHello();
  }
}
