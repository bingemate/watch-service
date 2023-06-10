import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EpisodeWatchListItemEntity } from './episode-watch-list-item.entity';
import { EpisodeWatchListStatus } from './episode-watch-list-status.enum';

@Injectable()
export class EpisodeWatchListService {
  constructor(
    @InjectRepository(EpisodeWatchListItemEntity)
    private readonly watchListRepository: Repository<EpisodeWatchListItemEntity>,
  ) {}

  async getWatchListByUserId(
    userId: string,
  ): Promise<EpisodeWatchListItemEntity[]> {
    return await this.watchListRepository
      .createQueryBuilder()
      .where({ userId })
      .getMany();
  }

  async getWatchListItemById(
    userId: string,
    episodeId: number,
  ): Promise<EpisodeWatchListItemEntity> {
    return await this.watchListRepository
      .createQueryBuilder()
      .where({ userId, episodeId })
      .getOne();
  }

  async createWatchListItem(watchListItemEntity: EpisodeWatchListItemEntity) {
    await this.watchListRepository.save(watchListItemEntity);
  }

  async deleteWatchListItem(userId: string, episodeId: number) {
    await this.watchListRepository.delete({ userId, episodeId });
  }

  async updateWatchListItem(
    param: {
      episodeId: number;
      userId: string;
    },
    status: EpisodeWatchListStatus,
  ) {
    await this.watchListRepository.update(param, { status });
  }
}
