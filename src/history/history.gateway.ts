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
import { HistoryUpdateTypeEnum } from './history-update-type.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ namespace: 'watch' })
export class HistoryGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private userSessions = new Map<string, string>();

  constructor(
    private historyService: HistoryService,
    private eventEmitter: EventEmitter2,
  ) {}

  async handleConnection(client: Socket) {
    await this.createUserPeriod(
      client.id,
      client.handshake.headers['user-id'] as string,
      client.handshake.query.mediaId as string,
    );
  }

  async handleDisconnect(client: Socket) {
    const mediaHistory = await this.historyService.getHistoryById(
      this.userSessions.get(client.id),
    );
    this.userSessions.delete(client.id);
    mediaHistory.finishedAt = new Date();

    this.eventEmitter.emit(`history.updated`, mediaHistory);
    if (
      Math.abs(
        mediaHistory.startedAt.getTime() - mediaHistory.finishedAt.getTime(),
      ) /
        1000 <
      60
    ) {
      await this.historyService.deleteMediaHistory(mediaHistory.id);
      return;
    }
    await this.historyService.updateMediaHistory(mediaHistory);
  }

  @SubscribeMessage('updateMediaHistory')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() historyUpdate: UpdateMediaHistoryDto,
  ): Promise<void> {
    const mediaHistory = {
      id: this.userSessions.get(client.id),
      stoppedAt: historyUpdate.stoppedAt,
      finishedAt: undefined,
    };
    if (HistoryUpdateTypeEnum.PAUSED === historyUpdate.updateType) {
      const mediaHistory = await this.historyService.getHistoryById(
        this.userSessions.get(client.id),
      );
      mediaHistory.finishedAt = new Date();
      this.userSessions.delete(client.id);
    } else if (HistoryUpdateTypeEnum.UNPAUSED === historyUpdate.updateType) {
      await this.createUserPeriod(
        client.id,
        client.handshake.headers['user-id'] as string,
        client.handshake.query.mediaId as string,
      );
    }
    await this.historyService.updateMediaHistory(mediaHistory);
  }

  private async createUserPeriod(
    clientId: string,
    userId: string,
    mediaId: string,
  ) {
    const id = await this.historyService.createMediaHistory({
      mediaId,
      userId,
      stoppedAt: 0,
      startedAt: new Date(),
    });
    this.userSessions.set(clientId, id);
  }
}
