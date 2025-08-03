import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { ISeatEvent } from '@flick-finder/common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SeatType } from '../../seat-type/entities/seat-type.entity';
import { Hall } from '../../hall/entities/hall.entity';

@Entity({ name: 'seats' })
export class Seat
  extends BaseTimestampEntity
  implements Omit<ISeatEvent, '_id' | 'seatType' | 'hall'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @Column({ type: 'varchar', length: 10, name: 'seat_label' })
  readonly seatLabel: string;

  @ManyToOne(() => SeatType, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'seat_type_id' })
  readonly seatType: SeatType;

  @ManyToOne(() => Hall, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hall_id' })
  readonly hall: Hall;
}
