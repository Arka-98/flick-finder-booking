import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatReservation } from './entities/seat-reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SeatReservationService {
  constructor(
    @InjectRepository(SeatReservation)
    private readonly seatReservationRepository: Repository<SeatReservation>,
  ) {}

  async create() {
    
  }
}
