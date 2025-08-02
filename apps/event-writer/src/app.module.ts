import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from './persistence/persistence.module';
import { TypeOrmBookingModule } from '@app/common/modules/type-orm-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.event-writer' }),
    TypeOrmBookingModule,
    PersistenceModule,
  ],
})
export class AppModule {}
