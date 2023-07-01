import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { TvShowWatchListService } from './tv-show-watch-list.service';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';

@Injectable()
export class EpisodeWatchStatsListener {
  constructor(private watchListService: TvShowWatchListService) {}

  @OnEvent('tv-shows.playing')
  async handleMediaStartedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      const episodeWatchListItemEntity =
        await this.watchListService.getEpisodeWatchListItemById(
          payload.userId,
          payload.mediaId,
        );
      if (episodeWatchListItemEntity && payload.stoppedAt > 0.95) {
        await this.watchListService.updateEpisodeWatchListItem(
          {
            episodeId: payload.mediaId,
            userId: payload.userId,
          },
          TvShowWatchListStatus.FINISHED,
        );
      } else if (
        episodeWatchListItemEntity &&
        episodeWatchListItemEntity.status !== TvShowWatchListStatus.WATCHING
      ) {
        await this.watchListService.updateEpisodeWatchListItem(
          {
            episodeId: payload.mediaId,
            userId: payload.userId,
          },
          TvShowWatchListStatus.WATCHING,
        );
      } else if (!episodeWatchListItemEntity) {
        const tvShowWatchListItemEntity =
          await this.watchListService.getTvShowWatchListItemById(
            payload.userId,
            payload.tvShowId,
          );
        if (!tvShowWatchListItemEntity) {
          await this.watchListService.createTvShowWatchListItem({
            status: TvShowWatchListStatus.WATCHING,
            tvShowId: payload.tvShowId,
            userId: payload.userId,
            episodes: [],
          });
        }

        await this.watchListService.createEpisodeWatchListItem({
          episodeId: payload.mediaId,
          userId: payload.userId,
          status: TvShowWatchListStatus.WATCHING,
          tvShow: { tvShowId: payload.tvShowId, userId: payload.userId },
        });
      }
    } catch (e) {
      Logger.error('Error on episode start event', e);
    }
  }
}
