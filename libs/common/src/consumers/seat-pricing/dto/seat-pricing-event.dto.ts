import { IdDto } from '@app/common/dto/id.dto';
import { ISeatPricingEvent } from '@flick-finder/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject } from 'class-validator';

export class SeatPricingEventDto
  extends IdDto
  implements Omit<ISeatPricingEvent, 'showtime' | 'seatType'>
{
  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  showtime: { id: string };

  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  seatType: { id: string };

  @IsNumber()
  price: number;
}
