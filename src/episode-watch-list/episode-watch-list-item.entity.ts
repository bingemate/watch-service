import { Column, Entity, PrimaryColumn } from 'typeorm';
import { EpisodeWatchListStatus } from './episode-watch-list-status.enum';

@Entity('episode_watch_list_item')
export class EpisodeWatchListItemEntity {
  @PrimaryColumn()
  episodeId: number;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({
    enum: EpisodeWatchListStatus,
    nullable: true,
  })
  status: EpisodeWatchListStatus;

  @Column({ nullable: true })
  viewedEpisodes: number;
}
