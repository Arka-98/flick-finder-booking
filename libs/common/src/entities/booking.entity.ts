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

  /**
   * A snapshot of the seat IDs at the time of creating / updating the booking.
   */
  @Column('varchar', { array: true, length: 24, name: 'seat_ids_snapshot' })
  seatIdsSnapshot: string[];

  @Column({ type: 'text', name: 'stripe_checkout_session_id', nullable: true })
  stripeCheckoutSessionId?: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtime_id' })
  showtime: Showtime;
}
