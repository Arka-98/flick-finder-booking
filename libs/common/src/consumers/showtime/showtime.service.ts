import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeEventDto } from './dto/showtime-event.dto';
import { ShowtimeSeat } from './entities/showtime-seat.entity';
import { Seat } from '../seat/entities/seat.entity';

@Injectable()
export class ShowtimeConsumerService {
  constructor(
    @InjectRepository(Showtime)
    private readonly showtimeRepository: Repository<Showtime>,
    @InjectRepository(ShowtimeSeat)
    private readonly showtimeSeatsRepository: Repository<ShowtimeSeat>,
    @InjectRepository(Seat)
    private readonly seatRepository: Repository<Seat>,
  ) {}

  async createShowtime(showtime: ShowtimeEventDto) {
    const createdShowtime = await this.showtimeRepository
      .createQueryBuilder()
      .insert()
      .values({
        ...showtime,
        movie: { id: showtime.movie },
        hall: { id: showtime.hall },
      })
      .returning('*')
      .execute();
    const seats = await this.seatRepository.find({
      select: ['id'],
      where: { hall: { id: showtime.hall } },
    });

    await this.showtimeSeatsRepository
      .createQueryBuilder()
      .insert()
      .values(
        seats.map((seat) => ({
          showtime: { id: createdShowtime.raw[0].id },
          seat: { id: seat.id },
        })),
      )
      .execute();
  }

  updateShowtime(
    showtimeId: string,
    showtimeUpdateBody: Omit<ShowtimeEventDto, '_id'>,
  ) {
    return this.showtimeRepository.update(
      { id: showtimeId },
      {
        ...showtimeUpdateBody,
        movie: { id: showtimeUpdateBody.movie },
        hall: { id: showtimeUpdateBody.hall },
      },
    );
  }

  deleteShowtime(showtimeId: string) {
    return this.showtimeRepository.delete({ id: showtimeId });
  }
}
