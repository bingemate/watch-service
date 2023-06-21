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
      const item = await this.watchListService.getWatchListItemById(
        payload.userId,
        payload.mediaId,
      );
      if (item && payload.stoppedAt > 0.95) {
        await this.watchListService.updateEpisodeWatchListItem(
          {
            episodeId: payload.mediaId,
            userId: payload.userId,
          },
          TvShowWatchListStatus.FINISHED,
        );
      } else if (item && item.status !== TvShowWatchListStatus.WATCHING) {
        await this.watchListService.updateEpisodeWatchListItem(
          {
            episodeId: payload.mediaId,
            userId: payload.userId,
          },
          TvShowWatchListStatus.WATCHING,
        );
      } else if (!item) {
        try {
          this.watchListService.createTvShowWatchListItem({
            status: TvShowWatchListStatus.WATCHING,
            tvShowId: payload.tvShowId,
            userId: payload.userId,
            episodes: [],
          });
        } catch (e) {}
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
