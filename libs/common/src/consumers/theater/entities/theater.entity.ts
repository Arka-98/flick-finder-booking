import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { ITheaterEvent } from '@flick-finder/common';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'theaters' })
export class Theater
  extends BaseTimestampEntity
  implements Omit<ITheaterEvent, '_id'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @Column({ type: 'varchar', length: 200 })
  readonly name: string;

  @Column({ type: 'varchar', length: 400 })
  readonly address: string;
}
