import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeConsumerController } from './showtime.consumer';
import { ShowtimeConsumerService } from './showtime.service';
import { ShowtimeSeat } from './entities/showtime-seat.entity';
import { Seat } from '../seat/entities/seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Showtime, ShowtimeSeat, Seat])],
  controllers: [ShowtimeConsumerController],
  providers: [ShowtimeConsumerService],
})
export class ShowtimeConsumerModule {}
