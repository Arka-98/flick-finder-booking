import { IdDto } from '@app/common/dto/id.dto';
import { ITheaterEvent } from '@flick-finder/common';
import { IsString } from 'class-validator';

export class TheaterEventDto extends IdDto implements ITheaterEvent {
  @IsString()
  name: string;

  @IsString()
  address: string;
}
