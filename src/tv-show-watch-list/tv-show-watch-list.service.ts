import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TvShowWatchListItemEntity } from './tv-show-watch-list-item.entity';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';
import { EpisodeWatchListItemEntity } from './episode-watch-list-item.entity';

@Injectable()
export class TvShowWatchListService {
  constructor(
    @InjectRepository(TvShowWatchListItemEntity)
    private readonly tvShowWatchListRepository: Repository<TvShowWatchListItemEntity>,
    @InjectRepository(EpisodeWatchListItemEntity)
    private readonly episodeWatchListRepository: Repository<EpisodeWatchListItemEntity>,
  ) {}

  async getWatchListByUserId(
    userId: string,
  ): Promise<TvShowWatchListItemEntity[]> {
    return await this.tvShowWatchListRepository.findBy({ userId });
  }

  async getWatchListItemById(
    userId: string,
    tvShowId: number,
  ): Promise<TvShowWatchListItemEntity> {
    return await this.tvShowWatchListRepository
      .createQueryBuilder()
      .where({ userId, tvShowId })
      .getOne();
  }

  async createEpisodeWatchListItem(item: {
    tvShow: { tvShowId: number; userId: string };
    episodeId: number;
    userId: string;
    status: TvShowWatchListStatus;
  }) {
    await this.episodeWatchListRepository.save(item);
  }

  async createTvShowWatchListItem(
    watchListItemEntity: TvShowWatchListItemEntity,
  ) {
    await this.tvShowWatchListRepository.save(watchListItemEntity);
  }

  async deleteTvShowWatchListItem(userId: string, tvShowId: number) {
    await this.tvShowWatchListRepository.delete({ userId, tvShowId: tvShowId });
  }

  async updateTvShowWatchListItem(
    param: {
      tvShowId: number;
      userId: string;
    },
    status: TvShowWatchListStatus,
  ) {
    await this.tvShowWatchListRepository.update(param, { status });
  }

  async updateEpisodeWatchListItem(
    param: {
      episodeId: number;
      userId: string;
    },
    status: TvShowWatchListStatus,
  ) {
    await this.episodeWatchListRepository.update(param, { status });
  }
}
