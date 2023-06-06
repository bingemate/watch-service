import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlaylistItemEntity } from './playlist-item.entity';
import { PlaylistTypeEnum } from './playlist-type.enum';

@Entity('playlist')
export class PlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column({ enum: PlaylistTypeEnum })
  type: PlaylistTypeEnum;

  @OneToMany(() => PlaylistItemEntity, (media) => media.playlist, {
    cascade: true,
  })
  medias: PlaylistItemEntity[];
}
