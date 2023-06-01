import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchListItemEntity } from './watch-list-item.entity';
import { WatchListStatus } from './watch-list-status.enum';

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(WatchListItemEntity)
    private readonly watchListRepository: Repository<WatchListItemEntity>,
  ) {}

  async getWatchListByUserId(userId: string): Promise<WatchListItemEntity[]> {
    return await this.watchListRepository
      .createQueryBuilder()
      .where({ userId })
      .getMany();
  }

  async createWatchListItem(watchListItemEntity: WatchListItemEntity) {
    await this.watchListRepository.save(watchListItemEntity);
  }

  async updateWatchListItem(watchListItemEntity: WatchListItemEntity) {
    await this.watchListRepository.save(watchListItemEntity);
  }

  async deleteWatchListItem(userId: string, mediaId: number) {
    await this.watchListRepository.delete({ userId, mediaId });
  }

  async updateWatchlist(
    param: {
      mediaId: number;
      userId: string;
    },
    status: WatchListStatus,
  ) {
    await this.watchListRepository.update(param, { status });
  }
}
