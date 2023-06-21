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

@WebSocketGateway({ cors: true })
export class HistoryGateway implements OnGatewayConnection {
  constructor(
    private episodeHistoryService: EpisodeHistoryService,
    private movieHistoryService: MovieHistoryService,
    private eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage('updateMediaHistory')
  async updateMediaHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() historyUpdate: UpdateHistoryDto,
  ): Promise<void> {
    try {
      const type = client.handshake.query.type;
      const mediaHistory: HistoryUpdatedEvent = {
        mediaId: parseInt(client.handshake.query.mediaId as string),
        userId: client.handshake.headers['user-id'] as string,
        sessionId: client.id,
        stoppedAt: historyUpdate.stoppedAt,
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
        mediaId: parseInt(client.handshake.query.mediaId as string),
        userId: client.handshake.headers['user-id'] as string,
        sessionId: client.id,
      });
    } catch (e) {
      console.log(e);
    }
  }

  onDisconnect(client: Socket) {
    try {
      const type = client.handshake.query.type;
      const event: HistoryUpdatedEvent = {
        mediaId: parseInt(client.handshake.query.mediaId as string),
        userId: client.handshake.headers['user-id'] as string,
        sessionId: client.id,
      };
      this.eventEmitter.emit(`${type}.stopped`, event);
    } catch (e) {
      console.log(e);
    }
  }
}
