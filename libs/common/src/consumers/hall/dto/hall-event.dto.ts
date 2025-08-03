import { IdDto } from '@app/common/dto/id.dto';
import { IHallEvent } from '@flick-finder/common';
import { IsMongoId, IsNumber } from 'class-validator';

export class HallEventDto extends IdDto implements Omit<IHallEvent, 'theater'> {
  @IsMongoId()
  theater: string;

  @IsNumber()
  totalSeats: number;
}
