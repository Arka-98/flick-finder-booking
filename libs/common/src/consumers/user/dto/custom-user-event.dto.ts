import { UserEventDto } from '@flick-finder/common';
import { Expose } from 'class-transformer';

export class CustomUserEventDto extends UserEventDto {
  @Expose({ name: 'id', toPlainOnly: true })
  _id: string;
}
