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

@WebSocketGateway({ namespace: 'watch-together', cors: true })
export class WatchTogetherGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  joinedRoom = new Map<string, string>();
  rooms = new Map<string, WatchTogetherRoom>();

  constructor(private watchTogetherService: WatchTogetherService) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth['token'];
      const userId = await this.watchTogetherService.getSession(token);
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
      const userId = await this.watchTogetherService.getSession(token);
      client.leave(userId);
      const roomId = this.joinedRoom.get(userId);
      if (roomId) {
        const room = this.rooms.get(roomId);
        room.joinedSessions = room.joinedSessions.filter(
          (user) => client.id !== user,
        );
        this.joinedRoom.delete(userId);
        await this.deleteRoom(room);
      }
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
      const userId = await this.watchTogetherService.getSession(token);
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
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ): Promise<void> {
    try {
      const room = this.rooms.get(roomId);
      const token = client.handshake.auth['token'];
      const userId = await this.watchTogetherService.getSession(token);
      if (
        room &&
        room.invitedUsers.includes(userId) &&
        !this.joinedRoom.has(client.id)
      ) {
        room.joinedSessions.push(client.id);
        this.joinedRoom.set(client.id, roomId);
        client.emit('roomJoined', room);
      }
    } catch (e) {
      Logger.error('Error while joining room', e);
    }
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: Socket) {
    try {
      const roomId = this.joinedRoom.get(client.id);
      if (roomId) {
        this.joinedRoom.delete(client.id);
        const room = this.rooms.get(roomId);
        room.joinedSessions = room.joinedSessions.filter(
          (user) => user !== client.id,
        );
        await this.deleteRoom(room);
      }
    } catch (e) {
      Logger.error('Error while leaving room', e);
    }
  }

  @SubscribeMessage('getRooms')
  async getRooms(@ConnectedSocket() client: Socket) {
    try {
      const token = client.handshake.auth['token'];
      const userId = await this.watchTogetherService.getSession(token);
      const rooms = await this.getUserRooms(userId);
      client.emit('rooms', rooms);
    } catch (e) {
      Logger.error('Error on get rooms', e);
    }
  }

  @SubscribeMessage('addMedia')
  async addMedia(
    @ConnectedSocket() client: Socket,
    @MessageBody() mediaId: number,
  ) {
    try {
      const roomId = this.joinedRoom.get(client.id);
      const room = this.rooms.get(roomId);
      if (room && room.joinedSessions.includes(client.id)) {
        room.mediaIds.push(mediaId);
        room.joinedSessions.forEach((user) =>
          this.server.to(user).emit('addedMedia', mediaId),
        );
      }
    } catch (e) {
      Logger.error('Error while adding media', e);
    }
  }

  @SubscribeMessage('pause')
  async paused(@ConnectedSocket() client: Socket) {
    try {
      const roomId = this.joinedRoom.get(client.id);
      const room = this.rooms.get(roomId);
      if (room && room.joinedSessions.includes(client.id)) {
        room.status = WatchTogetherStatus.PAUSED;
      }
    } catch (e) {
      Logger.error('Error while pausing', e);
    }
  }

  @SubscribeMessage('play')
  async play(@ConnectedSocket() client: Socket) {
    try {
      const roomId = this.joinedRoom.get(client.id);
      const room = this.rooms.get(roomId);
      if (room && room.joinedSessions.includes(client.id)) {
        room.status = WatchTogetherStatus.PLAYING;
      }
    } catch (e) {
      Logger.error('Error on play', e);
    }
  }

  @SubscribeMessage('playing')
  async playing(
    @ConnectedSocket() client: Socket,
    @MessageBody() position: number,
  ) {
    try {
      const token = client.handshake.auth['token'];
      const userId = await this.watchTogetherService.getSession(token);
      const roomId = this.joinedRoom.get(client.id);
      const room = this.rooms.get(roomId);
      if (room && room.joinedSessions.includes(client.id)) {
        if (room.ownerId === userId) {
          room.position = position;
        }
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
      const roomId = this.joinedRoom.get(client.id);
      const room = this.rooms.get(roomId);
      if (room && room.joinedSessions.includes(client.id)) {
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
      const roomId = this.joinedRoom.get(client.id);
      const room = this.rooms.get(roomId);
      if (
        room &&
        room.joinedSessions.includes(client.id) &&
        playlistPosition < room.mediaIds.length
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
      const roomId = this.joinedRoom.get(client.id);
      if (roomId) {
        const room = this.rooms.get(roomId);
        client.emit('roomStatus', room);
      }
    } catch (e) {
      Logger.error('Error while changing media', e);
    }
  }

  private async deleteRoom(room: WatchTogetherRoom) {
    try {
      if (room.joinedSessions.length === 0) {
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
}
