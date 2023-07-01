import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieWatchListItemEntity } from './movie-watch-list-item.entity';
import { MovieWatchListStatus } from './movie-watch-list-status.enum';

@Injectable()
export class MovieWatchListService {
  constructor(
    @InjectRepository(MovieWatchListItemEntity)
    private readonly watchListRepository: Repository<MovieWatchListItemEntity>,
  ) {}

  async getWatchListByUserId(
    userId: string,
  ): Promise<MovieWatchListItemEntity[]> {
    return await this.watchListRepository
      .createQueryBuilder()
      .where({ userId })
      .getMany();
  }

  async getWatchListItemById(
    userId: string,
    movieId: number,
  ): Promise<MovieWatchListItemEntity> {
    return await this.watchListRepository
      .createQueryBuilder()
      .where({ userId, movieId })
      .getOne();
  }

  async createWatchListItem(watchListItemEntity: MovieWatchListItemEntity) {
    await this.watchListRepository.save(watchListItemEntity);
  }

  async deleteWatchListItem(userId: string, movieId: number) {
    await this.watchListRepository.delete({ userId, movieId: movieId });
  }

  async updateWatchListItem(
    param: {
      movieId: number;
      userId: string;
    },
    status: MovieWatchListStatus,
  ) {
    await this.watchListRepository.update(param, { status });
  }
}
