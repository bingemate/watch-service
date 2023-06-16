import { Injectable } from '@nestjs/common';
import { MovieHistoryEntity } from './movie-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MovieHistoryService {
  constructor(
    @InjectRepository(MovieHistoryEntity)
    private readonly mediaHistoryRepository: Repository<MovieHistoryEntity>,
  ) {}

  async getHistoryByUserId(userId: string): Promise<MovieHistoryEntity[]> {
    return await this.mediaHistoryRepository
      .createQueryBuilder()
      .where('MovieHistoryEntity.userId=:userId', { userId })
      .orderBy('MovieHistoryEntity.viewedAt', 'DESC')
      .getMany();
  }

  async upsertMediaHistory(mediaHistory: {
    stoppedAt: number;
    movieId: number;
    userId: string;
  }): Promise<void> {
    await this.mediaHistoryRepository.save(mediaHistory);
  }

  async deleteMediaHistory(mediaId: number, userId: string): Promise<void> {
    await this.mediaHistoryRepository.delete({ movieId: mediaId, userId });
  }
}
