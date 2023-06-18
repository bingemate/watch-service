import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { MovieWatchStatsService } from './movie-watch-stats.service';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';

@Injectable()
export class MovieWatchStatsListener {
  private readonly sessions = new Map<string, string>();
  constructor(private watchStatsService: MovieWatchStatsService) {}

  @OnEvent('movies.started')
  async handleMediaStartedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      if (this.sessions.has(payload.sessionId)) {
        return;
      }
      const statPeriod = await this.watchStatsService.createStatsEntity({
        movieId: payload.mediaId,
        userId: payload.userId,
        startedAt: new Date(),
      });
      this.sessions.set(payload.sessionId, statPeriod.id);
    } catch (e) {
      Logger.error('Error on movie start event', e);
    }
  }

  @OnEvent('movies.stopped')
  async handleMediaStoppedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      const movieId = this.sessions.get(payload.sessionId);
      if (!movieId) {
        return;
      }
      const mediaHistory = await this.watchStatsService.getStatById(movieId);
      this.sessions.delete(payload.sessionId);
      mediaHistory.stoppedAt = new Date();
      if (
        Math.abs(
          mediaHistory.startedAt.getTime() - mediaHistory.stoppedAt.getTime(),
        ) /
          1000 <
        60
      ) {
        await this.watchStatsService.deleteStatPeriod(mediaHistory.id);
        return;
      }
      await this.watchStatsService.updateStatPeriod(mediaHistory);
    } catch (e) {
      Logger.error('Error on movie stop event', e);
    }
  }
}
