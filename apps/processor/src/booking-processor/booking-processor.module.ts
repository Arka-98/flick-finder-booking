import { Module } from '@nestjs/common';
import { BookingQueueEventListenerService } from './booking-queue-event-listener.service';
import { BookingProcessorService } from './booking-processor.service';
import { KafkaModule, StripeModule } from '@flick-finder/common';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '@app/common/entities/booking.entity';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueEnum.BOOKING }),
    TypeOrmModule.forFeature([Booking]),
    KafkaModule,
    StripeModule,
  ],
  providers: [BookingProcessorService, BookingQueueEventListenerService],
})
export class BookingProcessorModule {}
