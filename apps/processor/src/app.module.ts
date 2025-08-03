import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingProcessorModule } from './booking-processor/booking-processor.module';
import { BullMQModule } from '@app/common/modules';
import { TypeOrmBookingModule } from '@app/common/modules/type-orm-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.processor' }),
    TypeOrmBookingModule,
    BookingProcessorModule,
    BullMQModule,
  ],
})
export class AppModule {}
