import { IdDto } from '@app/common/dto/id.dto';
import { IShowtimeEvent } from '@flick-finder/common';
import { Transform } from 'class-transformer';
import { IsDateString, IsObject } from 'class-validator';

export class ShowtimeEventDto
  extends IdDto
  implements Omit<IShowtimeEvent, 'movie' | 'hall'>
{
  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  movie: { id: string };

  @Transform(({ value }) => ({ id: value }))
  @IsObject()
  hall: { id: string };

  @IsDateString()
  showtime: string;
}
