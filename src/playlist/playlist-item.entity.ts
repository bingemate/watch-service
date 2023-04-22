import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PlaylistEntity } from './playlist.entity';

@Entity('playlist_item')
export class PlaylistItemEntity {
  @PrimaryColumn('uuid')
  mediaId: string;

  @PrimaryColumn('uuid')
  playlistId: string;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.medias)
  playlist: PlaylistEntity;

  @Column()
  order: number;
}
