import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MovieHistoryService } from '../movie-history/movie-history.service';
import { EpisodeHistoryService } from '../episode-history/episode-history.service';
import { HistoryUpdatedEvent } from './events/history-updated.event';
import { HistoryService } from './history.service';

@WebSocketGateway({ namespace: 'history', cors: true })
export class HistoryGateway implements OnGatewayConnection {
  constructor(
    private episodeHistoryService: EpisodeHistoryService,
    private movieHistoryService: MovieHistoryService,
    private historyService: HistoryService,
    private eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage('updateMediaHistory')
  async updateMediaHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() historyUpdate: UpdateHistoryDto,
  ): Promise<void> {
    try {
      const token = client.handshake.auth['token'];
      const userId = this.historyService.getSession(token);
      const type = client.handshake.query.type;
      const mediaHistory: HistoryUpdatedEvent = {
        userId,
        sessionId: client.id,
        stoppedAt: historyUpdate.stoppedAt,
        mediaId: parseInt(client.handshake.query.mediaId as string),
        tvShowId: parseInt(client.handshake.query.tvShowId as string),
      };
      this.eventEmitter.emit(
        `${type}.${historyUpdate.watchStatus.toLowerCase()}`,
        mediaHistory,
      );
    } catch (e) {
      console.log(e);
    }
  }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth['token'];
      const userId = this.historyService.getSession(token);
      const mediaId = parseInt(client.handshake.query.mediaId as string);
      const type = client.handshake.query.type;
      if (isNaN(mediaId) && !type) {
        client.disconnect();
        return;
      }
      client.on('disconnecting', () => {
        this.onDisconnect(client);
      });
      this.eventEmitter.emit(`${type}.started`, {
        userId,
        sessionId: client.id,
        mediaId: parseInt(client.handshake.query.mediaId as string),
        tvShowId: parseInt(client.handshake.query.tvShowId as string),
      });
    } catch (e) {
      console.log(e);
    }
  }

  onDisconnect(client: Socket) {
    try {
      const token = client.handshake.auth['token'];
      const userId = this.historyService.getSession(token);
      this.historyService.deleteSession(token);
      const type = client.handshake.query.type;
      const event: HistoryUpdatedEvent = {
        userId,
        sessionId: client.id,
        mediaId: parseInt(client.handshake.query.mediaId as string),
      };
      this.eventEmitter.emit(`${type}.stopped`, event);
    } catch (e) {
      console.log(e);
    }
  }
}
