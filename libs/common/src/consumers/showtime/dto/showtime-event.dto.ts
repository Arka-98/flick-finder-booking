import { IdDto } from '@app/common/dto/id.dto';
import { IShowtimeEvent } from '@flick-finder/common';
import { IsDateString, IsMongoId } from 'class-validator';

export class ShowtimeEventDto
  extends IdDto
  implements Omit<IShowtimeEvent, 'movie' | 'hall'>
{
  @IsMongoId()
  movie: string;

  @IsMongoId()
  hall: string;

  @IsDateString()
  showtime: string;
}
