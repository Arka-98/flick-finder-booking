import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Showtime } from './showtime.entity';
import { Seat } from '../../seat/entities/seat.entity';
import { ShowtimeSeatStatusEnum } from '@app/common/enums/showtime-seat-status.enum';

@Entity({ name: 'showtime_seats' })
export class ShowtimeSeat extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtime_id' })
  readonly showtime: Showtime;

  @ManyToOne(() => Seat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  readonly seat: Seat;

  @Column({
    type: 'enum',
    enum: ShowtimeSeatStatusEnum,
    default: ShowtimeSeatStatusEnum.AVAILABLE,
  })
  readonly status: ShowtimeSeatStatusEnum;
}
