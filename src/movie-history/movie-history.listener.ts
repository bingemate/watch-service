import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { MovieHistoryService } from './movie-history.service';

@Injectable()
export class MovieHistoryListener {
  constructor(private movieHistoryService: MovieHistoryService) {}

  @OnEvent('movies.playing')
  async handleMediaPlayingEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      const history = await this.movieHistoryService.getHistory(
        payload.userId,
        payload.mediaId,
      );
      if (history) {
        await this.movieHistoryService.updateMovieHistory(
          payload.userId,
          payload.mediaId,
          payload.stoppedAt,
        );
      } else {
        await this.movieHistoryService.createMovieHistory({
          userId: payload.userId,
          movieId: payload.mediaId,
          stoppedAt: payload.stoppedAt,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
