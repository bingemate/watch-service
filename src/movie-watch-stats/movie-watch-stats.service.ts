import { Injectable } from '@nestjs/common';
import { MovieWatchStatsEntity } from './movie-watch-stats.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MovieWatchStatsService {
  constructor(
    @InjectRepository(MovieWatchStatsEntity)
    private readonly watchStatsRepository: Repository<MovieWatchStatsEntity>,
  ) {}

  async createStatsEntity(watchStatsEntity: {
    startedAt: Date;
    movieId: number;
    userId: string;
  }): Promise<MovieWatchStatsEntity> {
    return await this.watchStatsRepository.save(watchStatsEntity);
  }

  async getStatById(id: string) {
    return await this.watchStatsRepository.findOneBy({ id });
  }
  async deleteStatPeriod(id: string) {
    await this.watchStatsRepository.delete(id);
  }

  async updateStatPeriod(watchStatsEntity: MovieWatchStatsEntity) {
    await this.watchStatsRepository.save(watchStatsEntity);
  }

  async getStatsByUserId(userId: string) {
    return await this.watchStatsRepository
      .createQueryBuilder()
      .where('MovieWatchStatsEntity.userId=:userId', { userId })
      .andWhere('MovieWatchStatsEntity.stoppedAt NOT NULL')
      .getMany();
  }
}
