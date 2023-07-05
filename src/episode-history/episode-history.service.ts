import { Injectable } from '@nestjs/common';
import { EpisodeHistoryEntity } from './episode-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EpisodeHistoryService {
  constructor(
    @InjectRepository(EpisodeHistoryEntity)
    private readonly episodeHistoryRepository: Repository<EpisodeHistoryEntity>,
  ) {}

  async getHistoryByUserId(userId: string): Promise<EpisodeHistoryEntity[]> {
    return await this.episodeHistoryRepository
      .createQueryBuilder()
      .where('EpisodeHistoryEntity.userId=:userId', { userId })
      .orderBy('EpisodeHistoryEntity.viewedAt', 'DESC')
      .getMany();
  }

  async getHistory(userId: string, episodeId: number) {
    return this.episodeHistoryRepository.findOneBy({ userId, episodeId });
  }

  async createEpisodeHistory(mediaHistory: {
    stoppedAt: number;
    episodeId: number;
    userId: string;
  }): Promise<void> {
    await this.episodeHistoryRepository.save(mediaHistory);
  }

  async updateEpisodeHistory(
    userId: string,
    episodeId: number,
    stoppedAt: number,
  ): Promise<void> {
    await this.episodeHistoryRepository.update(
      { episodeId, userId },
      { stoppedAt },
    );
  }

  async deleteMediaHistory(episodeId: number, userId: string): Promise<void> {
    await this.episodeHistoryRepository.delete({ episodeId, userId });
  }

  async getHistoryList(userId: string, mediaList: number[]) {
    if (mediaList.length === 0) {
      return [];
    }
    return await this.episodeHistoryRepository
      .createQueryBuilder()
      .where('EpisodeHistoryEntity.userId=:userId', { userId })
      .andWhere('EpisodeHistoryEntity.episodeId IN (:...mediaList)', {
        mediaList,
      })
      .getMany();
  }
}
