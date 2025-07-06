import { ShowtimeSeat } from '@app/common/consumers/showtime/entities/showtime-seat.entity';
import { BookingEvent } from '@app/common/entities/booking-event.entity';
import { Booking } from '@app/common/entities/booking.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingQueueEventListenerService } from './booking-queue-event-listener.service';
import { BookingProcessorService } from './booking-processor.service';
import { KafkaModule } from '@flick-finder/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShowtimeSeat, BookingEvent, Booking]),
    KafkaModule,
  ],
  providers: [BookingProcessorService, BookingQueueEventListenerService],
})
export class BookingProcessorModule {}
