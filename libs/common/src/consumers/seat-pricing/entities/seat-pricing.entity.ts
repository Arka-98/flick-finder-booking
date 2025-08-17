import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { ISeatPricingEvent } from '@flick-finder/common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Showtime } from '../../showtime/entities/showtime.entity';
import { SeatType } from '../../seat-type/entities/seat-type.entity';

@Entity({ name: 'seat_pricings' })
export class SeatPricing
  extends BaseTimestampEntity
  implements Omit<ISeatPricingEvent, '_id' | 'showtime' | 'seatType'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @ManyToOne(() => Showtime, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'showtime_id' })
  readonly showtime: Showtime;

  @ManyToOne(() => SeatType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_type_id' })
  readonly seatType: SeatType;

  @Column({ type: 'real' })
  readonly price: number;

  @Column({ type: 'varchar', length: 30 })
  readonly stripePriceId: string;

  @Column({ type: 'varchar', length: 19 })
  readonly stripeProductId: string;

  @Column({ type: 'bool', default: false })
  readonly active: boolean;
}
