import { Module } from '@nestjs/common';
import { PersistenceController } from './persistence.controller';
import { PersistenceService } from './persistence.service';
import { RedisModule } from '@app/common/modules/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingEvent } from '@app/common/entities/booking-event.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_SERVICE_TOKEN } from '@app/common/constants';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookingEvent]),
    ScheduleModule.forRoot(),
    RedisModule,
    ClientsModule.registerAsync([
      {
        name: REDIS_SERVICE_TOKEN,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.REDIS,
          options: {
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [PersistenceController],
  providers: [PersistenceService],
})
export class PersistenceModule {}
