import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { IHallEvent } from '@flick-finder/common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Theater } from '../../theater/entities/theater.entity';

@Entity({ name: 'halls' })
export class Hall
  extends BaseTimestampEntity
  implements Omit<IHallEvent, '_id' | 'theater'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @ManyToOne(() => Theater, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'theater_id' })
  readonly theater: Theater;

  @Column({ type: 'int', name: 'total_seats' })
  readonly totalSeats: number;
}
