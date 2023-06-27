import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TvShowWatchListItemEntity } from './tv-show-watch-list-item.entity';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';
import { EpisodeWatchListItemEntity } from './episode-watch-list-item.entity';
import { EpisodeHistoryService } from '../episode-history/episode-history.service';

@Injectable()
export class TvShowWatchListService {
  constructor(
    @InjectRepository(TvShowWatchListItemEntity)
    private readonly tvShowWatchListRepository: Repository<TvShowWatchListItemEntity>,
    @InjectRepository(EpisodeWatchListItemEntity)
    private readonly episodeWatchListRepository: Repository<EpisodeWatchListItemEntity>,
    private readonly episodeHistoryService: EpisodeHistoryService,
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
    if (item.status === TvShowWatchListStatus.FINISHED) {
      const history = await this.episodeHistoryService.getHistory(item.userId, item.episodeId);
      if (history) {
        await this.episodeHistoryService.updateEpisodeHistory(item.userId, item.episodeId, 1);
      }else {
        await this.episodeHistoryService.createEpisodeHistory({
          episodeId: item.episodeId,
          userId: item.userId,
          stoppedAt: 1,
        });
      }
    }
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
    if (status === TvShowWatchListStatus.FINISHED) {
      const history = await this.episodeHistoryService.getHistory(param.userId, param.episodeId);
      if (history) {
        await this.episodeHistoryService.updateEpisodeHistory(param.userId, param.episodeId, 1);
      }else {
        await this.episodeHistoryService.createEpisodeHistory({
          episodeId: param.episodeId,
          userId: param.userId,
          stoppedAt: 1,
        });
      }
    }
  }
}
