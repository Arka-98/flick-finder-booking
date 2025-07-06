import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SeatEventDto } from './dto/seat-event.dto';

@Injectable()
export class SeatConsumerService {
  constructor(
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  createSeat(seat: SeatEventDto) {
    return this.seatRepository.insert(seat);
  }

  updateSeat(seatId: string, seatUpdateBody: Omit<SeatEventDto, '_id'>) {
    return this.seatRepository.update({ id: seatId }, seatUpdateBody);
  }

  deleteSeat(seatId: string) {
    return this.seatRepository.delete({ id: seatId });
  }
}
