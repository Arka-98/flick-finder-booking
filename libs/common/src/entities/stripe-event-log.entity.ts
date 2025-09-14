import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimestampEntity } from './base-timestamp.entity';

@Entity({ name: 'stripe_event_logs' })
@Index(['stripeEventType', 'stripeObjectId'], { unique: true })
export class StripeEventLog extends BaseTimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', name: 'stripe_event_id', unique: true })
  stripeEventId: string;

  @Column({ type: 'text', name: 'stripe_event_type' })
  stripeEventType: string;

  @Column({ type: 'text', name: 'stripe_object_id' })
  stripeObjectId: string;
}
