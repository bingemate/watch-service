import { Injectable } from '@nestjs/common';
import { EpisodeWatchStatsEntity } from './episode-watch-stats.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EpisodeWatchStatsService {
  constructor(
    @InjectRepository(EpisodeWatchStatsEntity)
    private readonly watchStatsRepository: Repository<EpisodeWatchStatsEntity>,
  ) {}

  async createStatsEntity(watchStatsEntity: {
    startedAt: Date;
    episodeId: number;
    userId: string;
  }): Promise<EpisodeWatchStatsEntity> {
    return await this.watchStatsRepository.save(watchStatsEntity);
  }

  async getStatById(id: string) {
    return await this.watchStatsRepository.findOneBy({ id });
  }
  async deleteStatPeriod(id: string) {
    await this.watchStatsRepository.delete(id);
  }

  async updateStatPeriod(watchStatsEntity: EpisodeWatchStatsEntity) {
    await this.watchStatsRepository.save(watchStatsEntity);
  }

  async getStatsByUserId(userId: string) {
    return await this.watchStatsRepository
      .createQueryBuilder()
      .where('EpisodeWatchStatsEntity.userId=:userId', { userId })
      .andWhere('EpisodeWatchStatsEntity.stoppedAt!=NULL')
      .getMany();
  }
}
