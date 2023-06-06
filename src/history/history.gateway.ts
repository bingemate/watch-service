import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UpdateMediaHistoryDto } from './dto/update-media-history.dto';
import { HistoryService } from './history.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: true })
export class HistoryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private historyService: HistoryService,
    private eventEmitter: EventEmitter2,
  ) {}

  @SubscribeMessage('updateMediaHistory')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() historyUpdate: UpdateMediaHistoryDto,
  ): Promise<void> {
    const mediaHistory = {
      mediaId: parseInt(client.handshake.query.mediaId as string),
      userId: client.handshake.headers['user-id'] as string,
      stoppedAt: historyUpdate.stoppedAt,
    };

    await this.historyService.upsertMediaHistory(mediaHistory);
    this.eventEmitter.emit(
      `media.${historyUpdate.watchStatus.toLowerCase()}`,
      mediaHistory,
    );
  }

  handleConnection(client: Socket) {
    const mediaId = parseInt(client.handshake.query.mediaId as string);
    if (isNaN(mediaId)) {
      client.disconnect();
      return;
    }
    this.eventEmitter.emit(`media.started`, {
      mediaId,
      userId: client.handshake.headers['user-id'] as string,
      sessionId: client.id,
    });
  }

  handleDisconnect(client: Socket) {
    this.eventEmitter.emit(`media.stopped`, {
      mediaId: parseInt(client.handshake.query.mediaId as string),
      userId: client.handshake.headers['user-id'] as string,
      sessionId: client.id,
    });
  }
}
