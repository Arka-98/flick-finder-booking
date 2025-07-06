import { BaseTimestampEntity } from '@app/common/entities/base-timestamp.entity';
import { IShowtimeEvent } from '@flick-finder/common';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { Hall } from '../../hall/entities/hall.entity';

@Entity({ name: 'showtimes' })
export class Showtime
  extends BaseTimestampEntity
  implements Omit<IShowtimeEvent, '_id' | 'movie' | 'hall' | 'showtime'>
{
  @PrimaryColumn({ type: 'varchar', length: 24 })
  readonly id: string;

  @ManyToOne(() => Movie, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'movie_id' })
  readonly movie: Movie;

  @ManyToOne(() => Hall, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hall_id' })
  readonly hall: Hall;

  @Column({ type: 'timestamp' })
  readonly showtime: Date;
}
