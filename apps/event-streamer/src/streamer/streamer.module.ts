import { Module } from '@nestjs/common';
import { StreamerController } from './streamer.controller';
import { StreamerService } from './streamer.service';
import { EventsEmitterModule } from '../events-emitter/events-emitter.module';

@Module({
  imports: [EventsEmitterModule],
  controllers: [StreamerController],
  providers: [StreamerService],
})
export class StreamerModule {}
