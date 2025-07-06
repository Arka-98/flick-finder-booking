import { Seat } from '@app/common/consumers/seat/entities/seat.entity';
import { Booking } from '@app/common/entities/booking.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'seat_reservations' })
export class SeatReservation {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => Seat, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_id' })
  readonly seat: Seat;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  readonly booking: Booking;
}
