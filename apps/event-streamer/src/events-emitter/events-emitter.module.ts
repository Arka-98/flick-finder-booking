import { RedisModule } from '@app/common/modules/redis/redis.module';
import { Module } from '@nestjs/common';
import { EventsEmitterService } from './events-emitter.service';

@Module({
  imports: [RedisModule],
  providers: [EventsEmitterService],
  exports: [EventsEmitterService],
})
export class EventsEmitterModule {}
