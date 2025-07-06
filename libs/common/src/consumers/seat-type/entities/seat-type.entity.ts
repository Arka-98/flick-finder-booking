import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { ISeatTypeEvent } from '@flick-finder/common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Theater } from '../../theater/entities/theater.entity';

@Entity({ name: 'seat_types' })
export class SeatType
  extends BaseTimestampEntity
  implements Omit<ISeatTypeEvent, '_id' | 'theater'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @ManyToOne(() => Theater, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theater_id' })
  readonly theater: Theater;

  @Column({ type: 'varchar', length: 50 })
  readonly type: string;
}
