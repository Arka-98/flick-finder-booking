import { Module } from '@nestjs/common';
import { EventWriterController } from './event-writer.controller';
import { EventWriterService } from './event-writer.service';

@Module({
  imports: [],
  controllers: [EventWriterController],
  providers: [EventWriterService],
})
export class EventWriterModule {}
