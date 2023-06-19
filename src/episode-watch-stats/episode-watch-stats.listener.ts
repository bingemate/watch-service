import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { EpisodeWatchStatsService } from './episode-watch-stats.service';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';

@Injectable()
export class EpisodeWatchStatsListener {
  private readonly sessions = new Map<string, string>();
  constructor(private watchStatsService: EpisodeWatchStatsService) {}

  @OnEvent('tv-shows.started')
  async handleMediaStartedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      if (this.sessions.has(payload.sessionId)) {
        return;
      }
      const statPeriod = await this.watchStatsService.createStatsEntity({
        episodeId: payload.mediaId,
        userId: payload.userId,
        startedAt: new Date(),
      });
      this.sessions.set(payload.sessionId, statPeriod.id);
    } catch (e) {
      Logger.error('Error on episode start event', e);
    }
  }

  @OnEvent('tv-shows.stopped')
  async handleMediaStoppedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      const episodeId = this.sessions.get(payload.sessionId);
      if (!episodeId) {
        return;
      }
      const mediaHistory = await this.watchStatsService.getStatById(episodeId);
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
      Logger.error('Error on episode stop event', e);
    }
  }
}
