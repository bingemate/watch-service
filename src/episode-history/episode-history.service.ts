import { Injectable } from '@nestjs/common';
import { EpisodeMediaHistoryEntity } from './episode-media-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EpisodeHistoryService {
  constructor(
    @InjectRepository(EpisodeMediaHistoryEntity)
    private readonly mediaHistoryRepository: Repository<EpisodeMediaHistoryEntity>,
  ) {}

  async getHistoryByUserId(
    userId: string,
  ): Promise<EpisodeMediaHistoryEntity[]> {
    return await this.mediaHistoryRepository
      .createQueryBuilder()
      .where('MediaHistoryEntity.userId=:userId', { userId })
      .orderBy('MediaHistoryEntity.viewedAt', 'DESC')
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
