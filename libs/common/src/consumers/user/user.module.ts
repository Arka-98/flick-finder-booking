import { Module } from '@nestjs/common';
import { UserConsumerController } from './user.consumer';
import { UserConsumerService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserConsumerController],
  providers: [UserConsumerService],
})
export class UserConsumerModule {}
