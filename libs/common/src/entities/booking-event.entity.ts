import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookingEventTypeEnum } from '@app/common/enums/booking-event-type.enum';
import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { Booking } from './booking.entity';

@Entity({ name: 'booking_events' })
export class BookingEvent extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  readonly bookingId: Booking;

  @Column({ type: 'enum', enum: BookingEventTypeEnum, name: 'event_type' })
  readonly eventType: BookingEventTypeEnum;

  @Column({ type: 'text', nullable: true })
  readonly message?: string;

  @Column({ type: 'json', nullable: true })
  readonly metadata?: Record<string, any>;
}
