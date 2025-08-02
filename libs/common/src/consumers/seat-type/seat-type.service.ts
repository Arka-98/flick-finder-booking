import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatType } from './entities/seat-type.entity';
import { SeatTypeEventDto } from './dto/seat-type-event.dto';

@Injectable()
export class SeatTypeConsumerService {
  constructor(
    @InjectRepository(SeatType)
    private readonly seatTypeRepository: Repository<SeatType>,
  ) {}

  createSeatType(seatType: SeatTypeEventDto) {
    return this.seatTypeRepository.insert({
      ...seatType,
      theater: { id: seatType.theater },
    });
  }

  updateSeatType(
    seatTypeId: string,
    seatTypeUpdateBody: Omit<SeatTypeEventDto, '_id'>,
  ) {
    return this.seatTypeRepository.update(
      { id: seatTypeId },
      {
        ...seatTypeUpdateBody,
        theater: { id: seatTypeUpdateBody.theater },
      },
    );
  }

  deleteSeatType(seatTypeId: string) {
    return this.seatTypeRepository.delete({ id: seatTypeId });
  }
}
