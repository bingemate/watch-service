import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { MovieHistoryService } from './movie-history.service';

@Injectable()
export class MovieHistoryListener {
  constructor(private movieHistoryService: MovieHistoryService) {}

  @OnEvent('movie.playing')
  async handleMediaPlayingEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      await this.movieHistoryService.upsertMediaHistory({
        movieId: payload.mediaId,
        userId: payload.userId,
        stoppedAt: payload.stoppedAt,
      });
    } catch (e) {
      console.log(e);
    }
  }
}
