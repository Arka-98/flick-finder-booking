import { IdDto } from '@app/common/dto/id.dto';
import { IMovieEvent } from '@flick-finder/common';
import { IsNumber, IsString } from 'class-validator';

export class MovieEventDto extends IdDto implements IMovieEvent {
  @IsString()
  title: string;

  @IsNumber()
  duration: number;
}
