import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BookingProcessorModule } from './booking-processor/booking-processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.processor' }),
    BookingProcessorModule,
  ],
})
export class ProcessorModule {}
