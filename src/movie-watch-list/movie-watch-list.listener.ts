import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { MovieWatchListService } from './movie-watch-list.service';
import { MovieWatchListStatus } from './movie-watch-list-status.enum';

@Injectable()
export class MovieWatchStatsListener {
  constructor(private watchListService: MovieWatchListService) {}

  @OnEvent('movies.playing')
  async handleMediaStartedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      const item = await this.watchListService.getWatchListItemById(
        payload.userId,
        payload.mediaId,
      );
      if (item && payload.stoppedAt > 0.95) {
        await this.watchListService.updateWatchListItem(
          {
            movieId: payload.mediaId,
            userId: payload.userId,
          },
          MovieWatchListStatus.FINISHED,
        );
      } else if (item && item.status !== MovieWatchListStatus.WATCHING) {
        await this.watchListService.updateWatchListItem(
          {
            movieId: payload.mediaId,
            userId: payload.userId,
          },
          MovieWatchListStatus.WATCHING,
        );
      } else {
        await this.watchListService.createWatchListItem({
          movieId: payload.mediaId,
          userId: payload.userId,
          status: MovieWatchListStatus.WATCHING,
        });
      }
    } catch (e) {
      Logger.error('Error on movie start event', e);
    }
  }
}
