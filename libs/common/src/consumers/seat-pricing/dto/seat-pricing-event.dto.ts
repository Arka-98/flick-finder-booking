import { IdDto } from '@app/common/dto/id.dto';
import { ISeatPricingEvent } from '@flick-finder/common';
import { IsMongoId, IsNumber } from 'class-validator';

export class SeatPricingEventDto
  extends IdDto
  implements Omit<ISeatPricingEvent, 'showtime' | 'seatType'>
{
  @IsMongoId()
  showtime: string;

  @IsMongoId()
  seatType: string;

  @IsNumber()
  price: number;
}
