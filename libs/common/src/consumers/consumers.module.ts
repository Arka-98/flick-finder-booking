import { Module } from '@nestjs/common';
import { UserConsumerModule } from './user/user.module';
import { HallConsumerModule } from './hall/hall.module';
import { TheaterConsumerModule } from './theater/theater.module';
import { MovieConsumerModule } from './movie/movie.module';
import { SeatConsumerModule } from './seat/seat.module';
import { SeatPricingConsumerModule } from './seat-pricing/seat-pricing.module';
import { SeatTypeConsumerModule } from './seat-type/seat-type.module';
import { ShowtimeConsumerModule } from './showtime/showtime.module';

@Module({
  imports: [
    UserConsumerModule,
    HallConsumerModule,
    TheaterConsumerModule,
    MovieConsumerModule,
    SeatConsumerModule,
    SeatPricingConsumerModule,
    SeatTypeConsumerModule,
    ShowtimeConsumerModule,
  ],
})
export class ConsumersModule {}
