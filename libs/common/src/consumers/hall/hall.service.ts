import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Hall } from './entities/hall.entity';
import { HallEventDto } from './dto/hall-event.dto';

@Injectable()
export class HallConsumerService {
  constructor(
    @InjectRepository(Hall) private readonly hallRepository: Repository<Hall>,
  ) {}

  createHall(hall: HallEventDto) {
    return this.hallRepository.insert({
      ...hall,
      theater: { id: hall.theater },
    });
  }

  updateHall(hallId: string, hallUpdateBody: Omit<HallEventDto, '_id'>) {
    return this.hallRepository.update(
      { id: hallId },
      { ...hallUpdateBody, theater: { id: hallUpdateBody.theater } },
    );
  }

  deleteHall(hallId: string) {
    return this.hallRepository.delete({ id: hallId });
  }
}
