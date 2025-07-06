import { IdDto } from '@app/common/dto/id.dto';
import { ISeatTypeEvent } from '@flick-finder/common';
import { Transform } from 'class-transformer';
import { IsObject, IsString } from 'class-validator';

export class SeatTypeEventDto
  extends IdDto
  implements Omit<ISeatTypeEvent, 'theater'>
{
  @IsString()
  type: string;

  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  theater: { id: string };
}
