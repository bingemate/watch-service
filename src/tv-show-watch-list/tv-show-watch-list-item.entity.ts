import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';

@Entity('tv_show_watch_list_item')
export class TvShowWatchListItemEntity {
  @PrimaryColumn()
  tvShowId: number;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;

  @Column()
  viewedEpisodes: number;
}
