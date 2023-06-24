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

  async getHistory(userId: string, movieId: number) {
    return this.mediaHistoryRepository.findOneBy({ userId, movieId });
  }

  async createMovieHistory(mediaHistory: {
    stoppedAt: number;
    movieId: number;
    userId: string;
  }): Promise<void> {
    await this.mediaHistoryRepository.save(mediaHistory);
  }

  async updateMovieHistory(
    userId: string,
    movieId: number,
    stoppedAt: number,
  ): Promise<void> {
    await this.mediaHistoryRepository.update(
      { movieId, userId },
      { stoppedAt },
    );
  }

  async deleteMediaHistory(mediaId: number, userId: string): Promise<void> {
    await this.mediaHistoryRepository.delete({ movieId: mediaId, userId });
  }
}
