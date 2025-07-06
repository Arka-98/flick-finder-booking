import { ITheaterEvent } from '@flick-finder/common';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TheaterEventDto } from './dto/theater-event.dto';
import { Theater } from './entities/theater.entity';

@Injectable()
export class TheaterConsumerService {
  constructor(
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  createTheater(theater: TheaterEventDto) {
    return this.theaterRepository.insert(theater);
  }

  updateTheater(
    theaterId: string,
    theaterUpdateBody: Omit<ITheaterEvent, '_id'>,
  ) {
    return this.theaterRepository.update({ id: theaterId }, theaterUpdateBody);
  }

  deleteTheater(theaterId: string) {
    return this.theaterRepository.delete({ id: theaterId });
  }
}
