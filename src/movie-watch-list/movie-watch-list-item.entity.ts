import { Column, Entity, PrimaryColumn } from 'typeorm';
import { MovieWatchListStatus } from './movie-watch-list-status.enum';

@Entity('movie_watch_list_item')
export class MovieWatchListItemEntity {
  @PrimaryColumn()
  episodeId: number;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ enum: MovieWatchListStatus })
  status: MovieWatchListStatus;
}
