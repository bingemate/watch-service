import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { EpisodeWatchStatsService } from './episode-watch-stats.service';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';

@Injectable()
export class EpisodeWatchStatsListener {
  private readonly sessions = new Map<string, string>();
  constructor(private watchStatsService: EpisodeWatchStatsService) {}

  @OnEvent('episode.started')
  async handleMediaStartedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    if (this.sessions.has(payload.sessionId)) {
      return;
    }
    const statPeriod = await this.watchStatsService.createStatsEntity({
      episodeId: payload.mediaId,
      userId: payload.userId,
      startedAt: new Date(),
    });
    this.sessions.set(payload.sessionId, statPeriod.id);
  }

  @OnEvent('episode.stopped')
  async handleMediaStoppedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    const mediaHistory = await this.watchStatsService.getStatById(
      this.sessions.get(payload.sessionId),
    );
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
  }
}
