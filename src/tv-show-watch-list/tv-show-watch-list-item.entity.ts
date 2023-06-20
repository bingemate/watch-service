import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';
import { EpisodeWatchListItemEntity } from './episode-watch-list-item.entity';

@Entity('tv_show_watch_list_item')
export class TvShowWatchListItemEntity {
  @PrimaryColumn()
  tvShowId: number;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({
    enum: TvShowWatchListStatus,
    default: TvShowWatchListStatus.PLAN_TO_WATCH,
  })
  status: TvShowWatchListStatus;

  @OneToMany(() => EpisodeWatchListItemEntity, (episode) => episode.tvShow, {
    eager: true,
  })
  episodes: EpisodeWatchListItemEntity[];
}
