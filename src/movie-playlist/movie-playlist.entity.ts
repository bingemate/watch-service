import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MoviePlaylistItemEntity } from './movie-playlist-item.entity';

@Entity('movie_playlist')
export class MoviePlaylistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @OneToMany(() => MoviePlaylistItemEntity, (media) => media.playlist, {
    cascade: true,
  })
  movies: MoviePlaylistItemEntity[];
}
