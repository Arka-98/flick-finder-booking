import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../consumers/user/entities/user.entity';
import { Hall } from '../consumers/hall/entities/hall.entity';
import { Movie } from '../consumers/movie/entities/movie.entity';
import { Seat } from '../consumers/seat/entities/seat.entity';
import { SeatPricing } from '../consumers/seat-pricing/entities/seat-pricing.entity';
import { SeatType } from '../consumers/seat-type/entities/seat-type.entity';
import { Showtime } from '../consumers/showtime/entities/showtime.entity';
import { ShowtimeSeat } from '../consumers/showtime/entities/showtime-seat.entity';
import { Theater } from '../consumers/theater/entities/theater.entity';
import { Booking } from '../entities/booking.entity';
import { BookingEvent } from '../entities/booking-event.entity';
import { SeatReservation } from '@apps/booking/src/seat-reservation/entities/seat-reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
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
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmBookingModule {}
