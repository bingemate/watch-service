import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { EpisodeHistoryService } from './episode-history.service';

@Injectable()
export class EpisodeWatchStatsListener {
  constructor(private episodeHistoryService: EpisodeHistoryService) {}

  @OnEvent('movie.playing')
  async handleMediaPlayingEvent(payload: HistoryUpdatedEvent): Promise<void> {
    await this.episodeHistoryService.upsertMediaHistory({
      episodeId: payload.mediaId,
      userId: payload.userId,
      stoppedAt: payload.stoppedAt,
    });
  }
}
