import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { IMovieEvent } from '@flick-finder/common';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'movies' })
export class Movie
  extends BaseTimestampEntity
  implements Omit<IMovieEvent, '_id'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @Column({ type: 'varchar', length: 200 })
  readonly title: string;

  @Column({ type: 'int' })
  readonly duration: number;
}
