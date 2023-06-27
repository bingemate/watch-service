import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { EpisodeHistoryService } from './episode-history.service';

@Injectable()
export class EpisodeWatchStatsListener {
  constructor(private episodeHistoryService: EpisodeHistoryService) {}

  @OnEvent('tv-shows.playing')
  async handleMediaPlayingEvent(payload: HistoryUpdatedEvent): Promise<void> {
    try {
      const history = await this.episodeHistoryService.getHistory(
        payload.userId,
        payload.mediaId,
      );
      if (history) {
        await this.episodeHistoryService.updateEpisodeHistory(
          payload.userId,
          payload.mediaId,
          payload.stoppedAt,
        );
      } else {
        await this.episodeHistoryService.createEpisodeHistory({
          userId: payload.userId,
          episodeId: payload.mediaId,
          stoppedAt: payload.stoppedAt,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }
}
