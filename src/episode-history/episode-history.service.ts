import { Injectable } from '@nestjs/common';
import { EpisodeHistoryEntity } from './episode-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EpisodeHistoryService {
  constructor(
    @InjectRepository(EpisodeHistoryEntity)
    private readonly mediaHistoryRepository: Repository<EpisodeHistoryEntity>,
  ) {}

  async getHistoryByUserId(userId: string): Promise<EpisodeHistoryEntity[]> {
    return await this.mediaHistoryRepository
      .createQueryBuilder()
      .where('EpisodeHistoryEntity.userId=:userId', { userId })
      .orderBy('EpisodeHistoryEntity.viewedAt', 'DESC')
      .getMany();
  }

  async upsertMediaHistory(mediaHistory: {
    stoppedAt: number;
    episodeId: number;
    userId: string;
  }): Promise<void> {
    await this.mediaHistoryRepository.save(mediaHistory);
  }

  async deleteMediaHistory(episodeId: number, userId: string): Promise<void> {
    await this.mediaHistoryRepository.delete({ episodeId, userId });
  }
}
