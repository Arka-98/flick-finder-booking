import { Module } from '@nestjs/common';
import { CommonLibsService } from './common-libs.service';
import { ConsumersModule } from './consumers/consumers.module';

@Module({
  imports: [ConsumersModule],
  providers: [CommonLibsService],
  exports: [CommonLibsService],
})
export class CommonLibsModule {}
