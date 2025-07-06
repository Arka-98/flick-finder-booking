import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatReservation } from './entities/seat-reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeatReservation])],
})
export class SeatReservationModule {}
