import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { HallConsumerController } from './hall.consumer';
import { HallConsumerService } from './hall.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hall])],
  controllers: [HallConsumerController],
  providers: [HallConsumerService],
})
export class HallConsumerModule {}
