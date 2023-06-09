import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddPlaylistMovieDto } from './dto/add-playlist-movie.dto';
import { MoviePlaylistEntity } from './movie-playlist.entity';
import { MoviePlaylistItemEntity } from './movie-playlist-item.entity';

@Injectable()
export class MoviePlaylistService {
  constructor(
    @InjectRepository(MoviePlaylistEntity)
    private readonly moviePlaylistRepository: Repository<MoviePlaylistEntity>,
    @InjectRepository(MoviePlaylistItemEntity)
    private readonly moviePlaylistItemRepository: Repository<MoviePlaylistItemEntity>,
  ) {}

  async createPlaylist(playlistCreation: {
    name: string;
    userId: string;
  }): Promise<string> {
    const playlist = await this.moviePlaylistRepository.save(playlistCreation);
    return playlist.id;
  }

  async getPlaylistsByUserId(userId: string): Promise<MoviePlaylistEntity[]> {
    return this.moviePlaylistRepository
      .createQueryBuilder()
      .where('PlaylistEntity.userId=:userId', { userId })
      .getMany();
  }

  async getPlaylistsById(id: string): Promise<MoviePlaylistEntity> {
    return this.moviePlaylistRepository.findOneBy({ id });
  }

  async getPlaylistItems(
    playlistId: string,
  ): Promise<MoviePlaylistItemEntity[]> {
    return this.moviePlaylistItemRepository
      .createQueryBuilder()
      .where('PlaylistItemEntity.playlistId=:playlistId', { playlistId })
      .orderBy('PlaylistItemEntity.position', 'ASC')
      .getMany();
  }

  async addMediaToPlaylist(
    playlistId: string,
    addMediaDto: AddPlaylistMovieDto,
  ): Promise<void> {
    const maxPosition = await this.moviePlaylistItemRepository.maximum(
      'position',
      {
        playlistId,
      },
    );
    await this.moviePlaylistItemRepository.save({
      playlistId,
      mediaId: addMediaDto.movieId,
      position: maxPosition + 1,
    });
  }

  async updatePlaylist(playlistUpdate: {
    id: string;
    medias: { mediaId: number }[];
  }): Promise<void> {
    const playlist = {
      id: playlistUpdate.id,
      medias: playlistUpdate.medias.map((item, index) => ({
        mediaId: item.mediaId,
        playlistId: playlistUpdate.id,
        position: index,
      })),
    };
    await this.moviePlaylistRepository.save(playlist);
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    await this.moviePlaylistRepository.delete(playlistId);
  }

  async removeMedia(playlistId: string, movieId: number) {
    await this.moviePlaylistItemRepository.delete({ playlistId, movieId });
  }
}
