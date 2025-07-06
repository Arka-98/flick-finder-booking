import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule, LoggerMiddleware } from '@flick-finder/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/common/consumers/user/entities/user.entity';
import { BullMQModule } from '@app/common/modules/bullmq.module';
import { CommonLibsModule } from '@app/common';
import { Hall } from '@app/common/consumers/hall/entities/hall.entity';
import { Movie } from '@app/common/consumers/movie/entities/movie.entity';
import { Seat } from '@app/common/consumers/seat/entities/seat.entity';
import { SeatPricing } from '@app/common/consumers/seat-pricing/entities/seat-pricing.entity';
import { SeatType } from '@app/common/consumers/seat-type/entities/seat-type.entity';
import { Showtime } from '@app/common/consumers/showtime/entities/showtime.entity';
import { Theater } from '@app/common/consumers/theater/entities/theater.entity';
import { ShowtimeSeat } from '@app/common/consumers/showtime/entities/showtime-seat.entity';
import { Booking } from '@app/common/entities/booking.entity';
import { BookingEvent } from '@app/common/entities/booking-event.entity';
import { SeatReservation } from './seat-reservation/entities/seat-reservation.entity';
import { BookingModule } from './booking-request/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.booking' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        schema: configService.get('DATABASE_SCHEMA'),
        entities: [
          User,
          Hall,
          Movie,
          Seat,
          SeatPricing,
          SeatType,
          Showtime,
          ShowtimeSeat,
          Theater,
          Booking,
          BookingEvent,
          SeatReservation,
        ],
      }),
      inject: [ConfigService],
    }),
    BullMQModule,
    CommonModule,
    CommonLibsModule,
    BookingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
