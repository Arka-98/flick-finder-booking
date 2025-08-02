import { Module } from '@nestjs/common';
import { BookingQueueEventListenerService } from './booking-queue-event-listener.service';
import { BookingProcessorService } from './booking-processor.service';
import { KafkaModule } from '@flick-finder/common';
import { QueueEnum } from '@app/common/enums/queue.enum';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '@app/common/entities/booking.entity';

@Module({
  imports: [
    BullModule.registerQueue({ name: QueueEnum.BOOKING }),
    TypeOrmModule.forFeature([Booking]),
    KafkaModule,
  ],
  providers: [BookingProcessorService, BookingQueueEventListenerService],
})
export class BookingProcessorModule {}
