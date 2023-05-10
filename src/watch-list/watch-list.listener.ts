import { HistoryUpdatedEvent } from '../history/events/history-updated.event';
import { OnEvent } from '@nestjs/event-emitter';
import { WatchListService } from './watch-list.service';
import { Injectable } from '@nestjs/common';
import { WatchListStatus } from './watch-list-status.enum';

@Injectable()
export class WatchListListener {
  constructor(private watchListService: WatchListService) {}

  @OnEvent('media.playing')
  async handleHistoryUpdatedEvent(payload: HistoryUpdatedEvent): Promise<void> {
    const status =
      payload.stoppedAt < 0.95
        ? WatchListStatus.WATCHING
        : WatchListStatus.FINISHED;
    await this.watchListService.upsertWatchListItem({
      userId: payload.userId,
      mediaId: payload.mediaId,
      status,
    });
  }
}
