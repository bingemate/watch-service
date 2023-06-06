import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistItemEntity } from './playlist-item.entity';
import { PlaylistEntity } from './playlist.entity';
import { PlaylistTypeEnum } from './playlist-type.enum';
import { AddMediaDto } from './dto/add-media.dto';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(PlaylistItemEntity)
    private readonly playlistItemRepository: Repository<PlaylistItemEntity>,
  ) {}

  async createPlaylist(playlistCreation: {
    name: string;
    type: PlaylistTypeEnum;
    userId: string;
  }): Promise<string> {
    const playlist = await this.playlistRepository.save(playlistCreation);
    return playlist.id;
  }

  async getPlaylistsByUserId(userId: string): Promise<PlaylistEntity[]> {
    return this.playlistRepository
      .createQueryBuilder()
      .where('PlaylistEntity.userId=:userId', { userId })
      .getMany();
  }

  async getPlaylistsById(id: string): Promise<PlaylistEntity> {
    return this.playlistRepository.findOneBy({ id });
  }

  async getPlaylistItems(playlistId: string): Promise<PlaylistItemEntity[]> {
    return this.playlistItemRepository
      .createQueryBuilder()
      .where('PlaylistItemEntity.playlistId=:playlistId', { playlistId })
      .orderBy('PlaylistItemEntity.position', 'ASC')
      .getMany();
  }

  async addMediaToPlaylist(
    playlistId: string,
    addMediaDto: AddMediaDto,
  ): Promise<void> {
    const maxPosition = await this.playlistItemRepository.maximum('position', {
      playlistId,
    });
    await this.playlistItemRepository.save({
      playlistId,
      mediaId: addMediaDto.mediaId,
      episode: addMediaDto.episode,
      season: addMediaDto.season,
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
    await this.playlistRepository.save(playlist);
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    await this.playlistRepository.delete(playlistId);
  }

  async removeMedia(playlistId: string, mediaId: number) {
    await this.playlistItemRepository.delete({ playlistId, mediaId });
  }
}
