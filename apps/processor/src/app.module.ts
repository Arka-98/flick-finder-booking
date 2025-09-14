import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingProcessorModule } from './booking-processor/booking-processor.module';
import { BullMQModule } from '@app/common/modules';
import { TypeOrmBookingModule } from '@app/common/modules/type-orm-booking.module';
import { CommonModule } from '@flick-finder/common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.processor' }),
    CommonModule.register(),
    TypeOrmBookingModule,
    BookingProcessorModule,
    BullMQModule,
  ],
})
export class AppModule {}
