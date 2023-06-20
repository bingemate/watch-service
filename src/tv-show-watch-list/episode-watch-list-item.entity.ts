import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';
import { TvShowWatchListItemEntity } from './tv-show-watch-list-item.entity';

@Entity('episode_watch_list_item')
export class EpisodeWatchListItemEntity {
  @PrimaryColumn()
  episodeId: number;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({
    enum: TvShowWatchListStatus,
    default: TvShowWatchListStatus.PLAN_TO_WATCH,
  })
  status: TvShowWatchListStatus;

  @ManyToOne(() => TvShowWatchListItemEntity, (tvShow) => tvShow.episodes)
  tvShow: TvShowWatchListItemEntity;
}
