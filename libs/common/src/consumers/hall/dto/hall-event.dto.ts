import { IdDto } from '@app/common/dto/id.dto';
import { IHallEvent } from '@flick-finder/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsObject } from 'class-validator';

export class HallEventDto extends IdDto implements Omit<IHallEvent, 'theater'> {
  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  theater: { id: string };

  @IsNumber()
  totalSeats: number;
}
