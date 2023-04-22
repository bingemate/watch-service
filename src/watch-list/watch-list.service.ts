import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchListItemEntity } from './watch-list-item.entity';

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

  async upsertWatchListItem(watchListItemEntity: WatchListItemEntity) {
    await this.watchListRepository.save(watchListItemEntity);
  }

  async deleteWatchListItem(userId: string, mediaId: string) {
    await this.watchListRepository.delete({ userId, mediaId });
  }
}
