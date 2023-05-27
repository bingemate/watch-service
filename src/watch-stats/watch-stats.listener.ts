import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { WatchStatsService } from './watch-stats.service';

@Injectable()
export class WatchStatsListener {
  private readonly sessions = new Map<string, string>();
  constructor(private watchStatsService: WatchStatsService) {}

  @OnEvent('media.started')
  async handleMediaStartedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    const statPeriod = await this.watchStatsService.createStatsEntity({
      mediaId: payload.mediaId,
      userId: payload.userId,
      startedAt: new Date(),
    });
    this.sessions.set(payload.sessionId, statPeriod.id);
  }

  @OnEvent('media.stopped')
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
