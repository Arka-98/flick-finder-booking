import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseTimestampEntity } from './base-timestamp.entity';
import { Showtime } from '../consumers/showtime/entities/showtime.entity';
import { BookingStatusEnum } from '../enums/booking-status.enum';
import { User } from '../consumers/user/entities/user.entity';

@Entity({ name: 'bookings' })
export class Booking extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
    name: 'job_id',
    nullable: true,
  })
  jobId?: string;

  @Column({ type: 'enum', enum: BookingStatusEnum })
  status: BookingStatusEnum;

  @Column('varchar', { array: true, length: 24, name: 'initial_seat_ids' })
  initialSeats: string[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;
}
