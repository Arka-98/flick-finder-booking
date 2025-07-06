import { IMovieEvent } from '@flick-finder/common';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { MovieEventDto } from './dto/movie-event.dto';

@Injectable()
export class MovieConsumerService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  createMovie(movie: MovieEventDto) {
    return this.movieRepository.insert(movie);
  }

  updateMovie(movieId: string, movieUpdateBody: Omit<IMovieEvent, '_id'>) {
    return this.movieRepository.update({ id: movieId }, movieUpdateBody);
  }

  deleteMovie(movieId: string) {
    return this.movieRepository.delete({ id: movieId });
  }
}
