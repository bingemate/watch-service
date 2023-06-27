import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieWatchListItemEntity } from './movie-watch-list-item.entity';
import { MovieWatchListStatus } from './movie-watch-list-status.enum';
import { MovieHistoryService } from '../movie-history/movie-history.service';

@Injectable()
export class MovieWatchListService {
  constructor(
    @InjectRepository(MovieWatchListItemEntity)
    private readonly watchListRepository: Repository<MovieWatchListItemEntity>,
    private readonly movieHistoryService: MovieHistoryService
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
    if (watchListItemEntity.status === MovieWatchListStatus.FINISHED) {
      const history = await this.movieHistoryService.getHistory(watchListItemEntity.userId, watchListItemEntity.movieId);
      if (history) {
        await this.movieHistoryService.updateMovieHistory(watchListItemEntity.userId, watchListItemEntity.movieId, 1);
      } else {
        await this.movieHistoryService.createMovieHistory({
          movieId: watchListItemEntity.movieId,
          userId: watchListItemEntity.userId,
          stoppedAt: 1,
        });
      }
    }
  }

  async deleteWatchListItem(userId: string, movieId: number) {
    await this.watchListRepository.delete({ userId, movieId: movieId });
    await this.movieHistoryService.deleteMediaHistory(movieId, userId);
  }

  async updateWatchListItem(
    param: {
      movieId: number;
      userId: string;
    },
    status: MovieWatchListStatus,
  ) {
    await this.watchListRepository.update(param, { status });
    if (status === MovieWatchListStatus.FINISHED) {
      const history = await this.movieHistoryService.getHistory(param.userId, param.movieId);
      if (history) {
        await this.movieHistoryService.updateMovieHistory(param.userId, param.movieId, 1);
      } else {
        await this.movieHistoryService.createMovieHistory({
          movieId: param.movieId,
          userId: param.userId,
          stoppedAt: 1,
        });
      }
    }
  }
}
