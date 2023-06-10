import { Injectable } from '@nestjs/common';
import { MovieMediaHistoryEntity } from './movie-media-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MovieHistoryService {
  constructor(
    @InjectRepository(MovieMediaHistoryEntity)
    private readonly mediaHistoryRepository: Repository<MovieMediaHistoryEntity>,
  ) {}

  async getHistoryByUserId(userId: string): Promise<MovieMediaHistoryEntity[]> {
    return await this.mediaHistoryRepository
      .createQueryBuilder()
      .where('MediaHistoryEntity.userId=:userId', { userId })
      .orderBy('MediaHistoryEntity.viewedAt', 'DESC')
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
