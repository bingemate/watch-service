import { Injectable } from '@nestjs/common';
import { WatchStatsEntity } from './watch-stats.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WatchStatsService {
  constructor(
    @InjectRepository(WatchStatsEntity)
    private readonly watchStatsRepository: Repository<WatchStatsEntity>,
  ) {}

  async createStatsEntity(watchStatsEntity: {
    startedAt: Date;
    mediaId: number;
    userId: string;
  }): Promise<WatchStatsEntity> {
    return await this.watchStatsRepository.save(watchStatsEntity);
  }

  async getStatById(id: string) {
    return await this.watchStatsRepository.findOneBy({ id });
  }
  async deleteStatPeriod(id: string) {
    await this.watchStatsRepository.delete(id);
  }

  async updateStatPeriod(watchStatsEntity: WatchStatsEntity) {
    await this.watchStatsRepository.save(watchStatsEntity);
  }

  async getStatsByuserId(userId: string) {
    return await this.watchStatsRepository
      .createQueryBuilder()
      .where('WatchStatsEntity.userId=:userId', { userId })
      .getMany();
  }
}
