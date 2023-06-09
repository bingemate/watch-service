import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { EpisodePlaylistEntity } from './episode-playlist.entity';

@Entity('episode_playlist_item')
export class EpisodePlaylistItemEntity {
  @PrimaryColumn()
  episodeId: number;

  @PrimaryColumn('uuid')
  playlistId: string;

  @ManyToOne(() => EpisodePlaylistEntity, (playlist) => playlist.episodes, {
    onDelete: 'CASCADE',
  })
  playlist: EpisodePlaylistEntity;

  @Column()
  position: number;
}
