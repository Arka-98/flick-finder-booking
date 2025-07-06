import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class IdDto {
  @Expose({ name: 'id', toPlainOnly: true })
  @IsString()
  _id: string;
}
