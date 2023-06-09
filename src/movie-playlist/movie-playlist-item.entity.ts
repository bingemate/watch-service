import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { MoviePlaylistEntity } from './movie-playlist.entity';

@Entity('movie_playlist_item')
export class MoviePlaylistItemEntity {
  @PrimaryColumn()
  movieId: number;

  @PrimaryColumn('uuid')
  playlistId: string;

  @ManyToOne(() => MoviePlaylistEntity, (playlist) => playlist.movies, {
    onDelete: 'CASCADE',
  })
  playlist: MoviePlaylistEntity;

  @Column()
  position: number;
}
