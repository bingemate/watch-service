import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UpdateHistoryDto } from './dto/update-history.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MovieHistoryService } from '../movie-history/movie-history.service';
import { EpisodeHistoryService } from '../episode-history/episode-history.service';

@WebSocketGateway({ cors: true })
export class HistoryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private episodeHistoryService: EpisodeHistoryService,
    private movieHistoryService: MovieHistoryService,
    private eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage('updateMediaHistory')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() historyUpdate: UpdateHistoryDto,
  ): Promise<void> {
    const type = parseInt(client.handshake.query.type as string);
    const mediaHistory = {
      episodeId: parseInt(client.handshake.query.mediaId as string),
      userId: client.handshake.headers['user-id'] as string,
      stoppedAt: historyUpdate.stoppedAt,
    };

    await this.episodeHistoryService.upsertMediaHistory(mediaHistory);
    this.eventEmitter.emit(
      `${type}.${historyUpdate.watchStatus.toLowerCase()}`,
      mediaHistory,
    );
  }

  handleConnection(client: Socket) {
    const mediaId = parseInt(client.handshake.query.mediaId as string);
    const type = parseInt(client.handshake.query.type as string);
    if (isNaN(mediaId) && !type) {
      client.disconnect();
      return;
    }
    this.eventEmitter.emit(`${type}.started`, {
      mediaId,
      userId: client.handshake.headers['user-id'] as string,
      sessionId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    const type = parseInt(client.handshake.query.type as string);
    this.eventEmitter.emit(`${type}.stopped`, {
      mediaId: parseInt(client.handshake.query.mediaId as string),
      userId: client.handshake.headers['user-id'] as string,
      sessionId: client.id,
    });
  }
}
