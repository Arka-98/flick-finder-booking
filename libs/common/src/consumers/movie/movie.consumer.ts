import { Public, TOPICS } from '@flick-finder/common';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MovieEventDto } from './dto/movie-event.dto';
import { MovieConsumerService } from './movie.service';

@Public()
@Controller('consumers')
export class MovieConsumerController {
  constructor(private readonly consumerService: MovieConsumerService) {}

  @EventPattern(TOPICS.MOVIE.CREATED)
  async handleMovieCreated(@Payload() movie: MovieEventDto) {
    return this.consumerService.createMovie(movie);
  }

  @EventPattern(TOPICS.MOVIE.UPDATED)
  async handleMovieUpdated(
    @Payload() { _id, ...movieUpdateBody }: MovieEventDto,
  ) {
    return this.consumerService.updateMovie(_id, movieUpdateBody);
  }

  @EventPattern(TOPICS.MOVIE.DELETED)
  async handleMovieDeleted(@Payload() movieId: string) {
    return this.consumerService.deleteMovie(movieId);
  }
}
