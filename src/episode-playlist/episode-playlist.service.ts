import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EpisodePlaylistItemEntity } from './episode-playlist-item.entity';
import { EpisodePlaylistEntity } from './episode-playlist.entity';
import { AddPlaylistEpisodeDto } from './dto/add-playlist-episode.dto';

@Injectable()
export class EpisodePlaylistService {
  constructor(
    @InjectRepository(EpisodePlaylistEntity)
    private readonly episodePlaylistRepository: Repository<EpisodePlaylistEntity>,
    @InjectRepository(EpisodePlaylistItemEntity)
    private readonly episodePlaylistItemRepository: Repository<EpisodePlaylistItemEntity>,
  ) {}

  async createPlaylist(playlistCreation: {
    name: string;
    userId: string;
  }): Promise<string> {
    const playlist = await this.episodePlaylistRepository.save(
      playlistCreation,
    );
    return playlist.id;
  }

  async getPlaylistsByUserId(userId: string): Promise<EpisodePlaylistEntity[]> {
    return this.episodePlaylistRepository
      .createQueryBuilder()
      .where('EpisodePlaylistEntity.userId=:userId', { userId })
      .getMany();
  }

  async getPlaylistsById(id: string): Promise<EpisodePlaylistEntity> {
    return this.episodePlaylistRepository.findOneBy({ id });
  }

  async getPlaylistItems(
    playlistId: string,
  ): Promise<EpisodePlaylistItemEntity[]> {
    return this.episodePlaylistItemRepository
      .createQueryBuilder()
      .where('EpisodePlaylistItemEntity.playlistId=:playlistId', { playlistId })
      .orderBy('EpisodePlaylistItemEntity.position', 'ASC')
      .getMany();
  }

  async addMediaToPlaylist(
    playlistId: string,
    addMediaDto: AddPlaylistEpisodeDto,
  ): Promise<void> {
    const maxPosition = await this.episodePlaylistItemRepository.maximum(
      'position',
      {
        playlistId,
      },
    );
    await this.episodePlaylistItemRepository.save({
      playlistId,
      mediaId: addMediaDto.episodeId,
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
    await this.episodePlaylistRepository.save(playlist);
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    await this.episodePlaylistRepository.delete(playlistId);
  }

  async removeMedia(playlistId: string, episodeId: number) {
    await this.episodePlaylistItemRepository.delete({ playlistId, episodeId });
  }
}
