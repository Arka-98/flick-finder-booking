import { IdDto } from '@app/common/dto/id.dto';
import { ISeatEvent } from '@flick-finder/common';
import { IsMongoId, IsString } from 'class-validator';

export class SeatEventDto
  extends IdDto
  implements Omit<ISeatEvent, 'hall' | 'seatType'>
{
  @IsMongoId()
  hall: string;

  @IsMongoId()
  seatType: string;

  @IsString()
  seatLabel: string;
}
