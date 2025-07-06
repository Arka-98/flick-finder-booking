import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatPricing } from './entities/seat-pricing.entity';
import { SeatPricingConsumerController } from './seat-pricing.consumer';
import { SeatPricingConsumerService } from './seat-pricing.service';

@Module({
  imports: [TypeOrmModule.forFeature([SeatPricing])],
  controllers: [SeatPricingConsumerController],
  providers: [SeatPricingConsumerService],
})
export class SeatPricingConsumerModule {}
