import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { RedisModule } from '@app/common/modules/redis/redis.module';
import { EventsEmitterModule } from '../events-emitter/events-emitter.module';

@Module({
  imports: [RedisModule, EventsEmitterModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
