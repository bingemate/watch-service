import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UpdateMediaHistoryDto } from './dto/update-media-history.dto';
import { HistoryService } from './history.service';

@WebSocketGateway({ namespace: 'watch' })
export class HistoryGateway {
  constructor(private historyService: HistoryService) {}

  @SubscribeMessage('updateMediaHistory')
  async getMessages(
    @ConnectedSocket() client: Socket,
    @MessageBody() historyUpdate: UpdateMediaHistoryDto,
  ): Promise<void> {
    const mediaHistory = {
      mediaId: historyUpdate.mediaId,
      userId: client.handshake.headers.userid as string,
      stoppedAt: historyUpdate.stoppedAt,
    };

    await this.historyService.upsertMediaHistory(mediaHistory);
  }
}
