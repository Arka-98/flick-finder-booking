import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatType } from './entities/seat-type.entity';
import { SeatTypeConsumerController } from './seat-type.consumer';
import { SeatTypeConsumerService } from './seat-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatType])],
  controllers: [SeatTypeConsumerController],
  providers: [SeatTypeConsumerService],
})
export class SeatTypeConsumerModule {}
