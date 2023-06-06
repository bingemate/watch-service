import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { PlaylistEntity } from './playlist.entity';

@Entity('playlist_item')
export class PlaylistItemEntity {
  @PrimaryColumn()
  mediaId: number;

  @PrimaryColumn('uuid')
  playlistId: string;

  @ManyToOne(() => PlaylistEntity, (playlist) => playlist.medias, {
    onDelete: 'CASCADE',
  })
  playlist: PlaylistEntity;

  @Column()
  position: number;

  @Column({ nullable: true })
  season: number;

  @Column({ nullable: true })
  episode: number;
}
