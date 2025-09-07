import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from '@app/common/modules/queue.module';
import { User } from '@app/common/consumers/user/entities/user.entity';
import { Showtime } from '@app/common/consumers/showtime/entities/showtime.entity';
import { Booking } from '@app/common/entities/booking.entity';
import { BookingEvent } from '@app/common/entities/booking-event.entity';
import { BullModule } from '@nestjs/bullmq';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { KafkaModule, StripeModule } from '@flick-finder/common';
import { ShowtimeSeat } from '@app/common/consumers/showtime/entities/showtime-seat.entity';
import { Seat } from '@app/common/consumers/seat/entities/seat.entity';
import { SeatPricing } from '@app/common/consumers/seat-pricing/entities/seat-pricing.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      User,
      Showtime,
      BookingEvent,
      ShowtimeSeat,
      Seat,
      SeatPricing,
    ]),
    BullModule.registerQueue({ name: QueueEnum.BOOKING }),
    QueueModule,
    KafkaModule,
    StripeModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
