import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SeatConsumerController } from './seat.consumer';
import { SeatConsumerService } from './seat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Seat])],
  controllers: [SeatConsumerController],
  providers: [SeatConsumerService],
})
export class SeatConsumerModule {}
