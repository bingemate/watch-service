import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlaylistItemEntity } from './playlist-item.entity';

@Entity('playlist')
export class PlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @OneToMany(() => PlaylistItemEntity, (media) => media.playlist, {
    cascade: true,
  })
  medias: PlaylistItemEntity[];
}
