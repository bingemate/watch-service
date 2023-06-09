import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EpisodePlaylistItemEntity } from './episode-playlist-item.entity';

@Entity('episode_playlist')
export class EpisodePlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @OneToMany(() => EpisodePlaylistItemEntity, (media) => media.playlist, {
    cascade: true,
  })
  episodes: EpisodePlaylistItemEntity[];
}
