import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  CommonModule,
  LoggerMiddleware,
  LoggerModule,
} from '@flick-finder/common';
import { BullMQModule } from '@app/common/modules/bullmq.module';
import { CommonLibsModule } from '@app/common';
import { BookingModule } from './booking/booking.module';
import { TypeOrmBookingModule } from '@app/common/modules/type-orm-booking.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.booking' }),
    CommonModule.register(),
    TypeOrmBookingModule,
    BullMQModule,
    CommonLibsModule,
    BookingModule,
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
