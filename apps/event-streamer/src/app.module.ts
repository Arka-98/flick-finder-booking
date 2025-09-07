import { Module } from '@nestjs/common';
import { StreamerModule } from './streamer/streamer.module';
import { EventsEmitterModule } from './events-emitter/events-emitter.module';
import { EventsModule } from './events/events.module';
import { CommonModule } from '@flick-finder/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.event-streamer',
    }),
    CommonModule.register(),
    StreamerModule,
    EventsModule,
    EventsEmitterModule,
  ],
})
export class AppModule {}
