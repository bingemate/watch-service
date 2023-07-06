import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  WatchTogetherRoom,
  WatchTogetherStatus,
} from './watch-together-room.model';
import { CreateWatchTogetherRoomDto } from './dto/create-watch-together-room.dto';
import { v4 as uuidv4 } from 'uuid';
import { WatchTogetherService } from './watch-together.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001, { namespace: 'watch-together', cors: true })
export class WatchTogetherGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  rooms = new Map<string, WatchTogetherRoom>();

  constructor(private watchTogetherService: WatchTogetherService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth['token'];
      const userId = this.watchTogetherService.getSession(token);
      if (!userId) {
        client.disconnect();
      }
      client.on('disconnecting', () => {
        this.onDisconnect(client);
      });
      client.join(userId);
    } catch (e) {
      Logger.error('Error while connecting', e);
    }
  }

  async onDisconnect(client: Socket) {
    try {
      const token = client.handshake.auth['token'];
      this.watchTogetherService.deleteSession(token);
      this.removeUserFromRoom(client);
    } catch (e) {
      Logger.error('Error while disconnecting', e);
    }
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoom: CreateWatchTogetherRoomDto,
  ): Promise<void> {
    try {
      const token = client.handshake.auth['token'];
      const userId = this.watchTogetherService.getSession(token);
      const roomId = uuidv4();
      const room = {
        id: roomId,
        ownerId: userId,
        joinedSessions: [],
        invitedUsers: createRoom.invitedUsers,
        playlistPosition: createRoom.playlistPosition,
        mediaIds: createRoom.mediaIds,
        mediaType: createRoom.mediaType,
        position: 0,
        status: WatchTogetherStatus.PAUSED,
        autoplay: true,
      };
      room.invitedUsers.push(userId);
      this.rooms.set(roomId, room);
      await this.watchTogetherService.createInvitations(
        room.invitedUsers.map((userId) => ({ userId, roomId })),
      );
      room.invitedUsers.forEach((user) => {
        if (user !== userId) {
          client.to(user).emit('invitedToRoom', room);
        }
      });
      client.emit('roomCreated', roomId);
    } catch (e) {
      Logger.error('Error on room creation', e);
    }
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody() roomId: string) {
    try {
      const room = this.rooms.get(roomId);
      if (room && !this.clientInRoom(client)) {
        client.join(room.id);
        client.emit('roomJoined', room);
      }
    } catch (e) {
      Logger.error('Error while joining room', e);
    }
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: Socket) {
    try {
      this.removeUserFromRoom(client);
    } catch (e) {
      Logger.error('Error while leaving room', e);
    }
  }

  @SubscribeMessage('getRooms')
  async getRooms(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.auth['token'];
      const userId = this.watchTogetherService.getSession(token);
      const rooms = await this.getUserRooms(userId);
      client.emit('rooms', rooms);
    } catch (e) {
      Logger.error('Error on get rooms', e);
    }
  }

  @SubscribeMessage('addMedia')
  addMedia(@ConnectedSocket() client: Socket, @MessageBody() mediaId: number) {
    try {
      const room = this.getClientRoom(client);
      if (room) {
        room.mediaIds.push(mediaId);
        this.server.to(room.id).emit('addedMedia', mediaId);
      }
    } catch (e) {
      Logger.error('Error while adding media', e);
    }
  }

  @SubscribeMessage('pause')
  paused(@ConnectedSocket() client: Socket) {
    try {
      const room = this.getClientRoom(client);
      if (room) {
        room.status = WatchTogetherStatus.PAUSED;
      }
    } catch (e) {
      Logger.error('Error while pausing', e);
    }
  }

  @SubscribeMessage('play')
  play(@ConnectedSocket() client: Socket) {
    try {
      const room = this.getClientRoom(client);
      if (room) {
        room.status = WatchTogetherStatus.PLAYING;
      }
    } catch (e) {
      Logger.error('Error on play', e);
    }
  }

  @SubscribeMessage('playing')
  playing(@ConnectedSocket() client: Socket, @MessageBody() position: number) {
    try {
      const token = client.handshake.auth['token'];
      const userId = this.watchTogetherService.getSession(token);
      const room = this.getClientRoom(client);
      if (room && room.ownerId === userId) {
        room.position = position;
      }
    } catch (e) {
      Logger.error('Error while playing', e);
    }
  }

  @SubscribeMessage('seek')
  async seek(
    @ConnectedSocket() client: Socket,
    @MessageBody() position: number,
  ) {
    try {
      const room = this.getClientRoom(client);
      if (room) {
        room.position = position;
      }
    } catch (e) {
      Logger.error('Error on seek', e);
    }
  }

  @SubscribeMessage('changeMedia')
  async changeMedia(
    @ConnectedSocket() client: Socket,
    @MessageBody() playlistPosition: number,
  ) {
    try {
      const room = this.getClientRoom(client);
      if (
        room &&
        playlistPosition < room.mediaIds.length &&
        playlistPosition >= 0
      ) {
        room.playlistPosition = playlistPosition;
      }
    } catch (e) {
      Logger.error('Error while changing media', e);
    }
  }

  @SubscribeMessage('getRoomStatus')
  async getRoomStatus(@ConnectedSocket() client: Socket) {
    try {
      const room = this.getClientRoom(client);
      if (room) {
        client.emit('roomStatus', room);
      }
    } catch (e) {
      Logger.error('Error while changing media', e);
    }
  }

  private async deleteRoom(room: WatchTogetherRoom) {
    try {
      console.log(this.server.adapter().prototype.rooms.length);
      console.log(this.server.adapter().prototype.rooms.size);
      if (this.server.adapter().prototype.rooms.length === 0) {
        console.log('deleted room');
        this.rooms.delete(room.id);
        await this.watchTogetherService.deleteInvitationsByRoomId(room.id);
        for (const user of room.invitedUsers) {
          const rooms = await this.getUserRooms(user);
          this.server.to(user).emit('rooms', rooms);
        }
      }
    } catch (e) {
      Logger.error('Error while deleting room', e);
    }
  }

  private async getUserRooms(userId: string) {
    const invitations = await this.watchTogetherService.getInvitationsByUserId(
      userId,
    );
    const rooms = [];
    for (const invitation of invitations) {
      const room = this.rooms.get(invitation.roomId);
      if (room) {
        rooms.push(room);
      } else {
        this.watchTogetherService
          .deleteInvitationsByRoomId(invitation.roomId)
          .then();
      }
    }
    return rooms;
  }

  private clientInRoom(client: Socket) {
    return client.rooms.size >= 3;
  }

  private getClientRoom(client: Socket): WatchTogetherRoom | undefined {
    const token = client.handshake.auth['token'];
    const userId = this.watchTogetherService.getSession(token);
    if (this.clientInRoom(client)) {
      const roomId = [...client.rooms]
        .filter((room) => room !== userId)
        .filter((room) => client.id !== room)[0];
      this.rooms.get(roomId);
    }
    return undefined;
  }

  private removeUserFromRoom(client: Socket) {
    const room = this.getClientRoom(client);
    if (room) {
      client.leave(room.id);
      this.deleteRoom(room).then();
    }
  }
}
