import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TvShowWatchListItemEntity } from './tv-show-watch-list-item.entity';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';

@Injectable()
export class TvShowWatchListService {
  constructor(
    @InjectRepository(TvShowWatchListItemEntity)
    private readonly watchListRepository: Repository<TvShowWatchListItemEntity>,
  ) {}

  async getWatchListByUserId(
    userId: string,
  ): Promise<TvShowWatchListItemEntity[]> {
    return await this.watchListRepository
      .createQueryBuilder()
      .where({ userId })
      .getMany();
  }

  async getWatchListItemById(
    userId: string,
    tvShowId: number,
  ): Promise<TvShowWatchListItemEntity> {
    return await this.watchListRepository
      .createQueryBuilder()
      .where({ userId, tvShowId })
      .getOne();
  }

  async createWatchListItem(watchListItemEntity: TvShowWatchListItemEntity) {
    await this.watchListRepository.save(watchListItemEntity);
  }

  async deleteWatchListItem(userId: string, tvShowId: number) {
    await this.watchListRepository.delete({ userId, tvShowId: tvShowId });
  }

  async updateWatchListItem(
    param: {
      tvShowId: number;
      userId: string;
    },
    status: TvShowWatchListStatus,
  ) {
    await this.watchListRepository.update(param, { status });
  }
}
