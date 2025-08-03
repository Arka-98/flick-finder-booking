import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonModule, LoggerMiddleware } from '@flick-finder/common';
import { ConfigModule } from '@nestjs/config';
import { BullMQModule } from '@app/common/modules/bullmq.module';
import { CommonLibsModule } from '@app/common';
import { BookingModule } from './booking/booking.module';
import { TypeOrmBookingModule } from '@app/common/modules/type-orm-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.booking' }),
    TypeOrmBookingModule,
    BullMQModule,
    CommonModule,
    CommonLibsModule,
    BookingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
