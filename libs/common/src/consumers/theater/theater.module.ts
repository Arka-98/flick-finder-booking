import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Theater } from './entities/theater.entity';
import { TheaterConsumerController } from './theater.consumer';
import { TheaterConsumerService } from './theater.service';

@Module({
  imports: [TypeOrmModule.forFeature([Theater])],
  controllers: [TheaterConsumerController],
  providers: [TheaterConsumerService],
})
export class TheaterConsumerModule {}
