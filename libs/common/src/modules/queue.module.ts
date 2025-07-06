import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueEnum } from '../enums/queue.enum';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueEnum.BOOKING,
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
