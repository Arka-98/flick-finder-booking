import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamerModule } from './streamer/streamer.module';
import { EventsEmitterModule } from './events-emitter/events-emitter.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.event-streamer',
    }),
    StreamerModule,
    EventsModule,
    EventsEmitterModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
