import { IdDto } from '@app/common/dto/id.dto';
import { ISeatEvent } from '@flick-finder/common';
import { Transform } from 'class-transformer';
import { IsObject, IsString } from 'class-validator';

export class SeatEventDto
  extends IdDto
  implements Omit<ISeatEvent, 'hall' | 'seatType'>
{
  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  hall: { id: string };

  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  seatType: { id: string };

  @IsString()
  rowLabel: string;
}
