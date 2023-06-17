import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class WatchTogetherGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  connectedUsers = new Map<string, string[]>();
  joinedRoom = new Map<string, string>();
  rooms = new Map<string, WatchTogetherRoom>();

  constructor(private watchTogetherService: WatchTogetherService) {}

  handleConnection(client: Socket) {
    try {
      const userId = client.handshake.headers['user-id'] as string;
      let sessions = this.connectedUsers.get(userId);
      if (sessions) {
        sessions.push(client.id);
      } else {
        sessions = [client.id];
      }
      this.connectedUsers.set(userId, sessions);
    } catch (e) {
      Logger.error('Error while connecting', e);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      const userId = client.handshake.headers['user-id'] as string;
      const userSessions = this.connectedUsers.get(userId);
      if (!userSessions) {
        return;
      }
      if (userSessions.length === 1) {
        this.connectedUsers.delete(userId);
      } else {
        this.connectedUsers.set(
          userId,
          userSessions.filter((user) => user !== userId),
        );
      }
      const roomId = this.joinedRoom.get(userId);
      if (roomId) {
        const room = this.rooms.get(roomId);
        room.joinedSessions = room.joinedSessions.filter(
          (user) => client.id !== user,
        );
        this.joinedRoom.delete(userId);
        this.deleteRoom(room);
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
      const roomId = uuidv4();
      const userId = client.handshake.headers['user-id'] as string;
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
        this.emitToUser(user, 'invitedToRoom', room);
      });
      client.emit('roomStatus', room);
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
      const userId = client.handshake.headers['user-id'] as string;
      if (
        room &&
        room.invitedUsers.includes(userId) &&
        !this.joinedRoom.has(client.id)
      ) {
        room.joinedSessions.push(client.id);
        this.joinedRoom.set(client.id, roomId);
        room.joinedSessions.forEach((user) =>
          this.server.to(user).emit('roomStatus', room),
        );
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
      const userId = client.handshake.headers['user-id'] as string;
      await this.emitRoomsToUser(userId);
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
          this.server.to(user).emit('roomStatus', room),
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
        room.joinedSessions.forEach((user) =>
          this.server.to(user).emit('roomStatus', room),
        );
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
      if (room.joinedSessions.includes(client.id)) {
        room.status = WatchTogetherStatus.PLAYING;
        room.joinedSessions.forEach((user) =>
          this.server.to(user).emit('roomStatus', room),
        );
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
      const userId = client.handshake.headers['user-id'] as string;
      const roomId = this.joinedRoom.get(client.id);
      const room = this.rooms.get(roomId);
      if (room.joinedSessions.includes(client.id)) {
        if (room.ownerId === userId) {
          room.position = position;
          room.joinedSessions.forEach((user) =>
            this.server.to(user).emit('roomStatus', room),
          );
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
      if (room.joinedSessions.includes(client.id)) {
        room.position = position;
        room.joinedSessions.forEach((user) =>
          this.server.to(user).emit('roomStatus', room),
        );
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
        room.joinedSessions.includes(client.id) &&
        playlistPosition < room.mediaIds.length
      ) {
        room.playlistPosition = playlistPosition;
        room.joinedSessions.forEach((user) =>
          this.server.to(user).emit('roomStatus', room),
        );
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
          await this.emitRoomsToUser(user);
        }
      }
    } catch (e) {
      Logger.error('Error while deleting room', e);
    }
  }

  private async emitRoomsToUser(userId: string) {
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
    this.emitToUser(userId, 'rooms', rooms);
  }

  private emitToUser(userId: string, message: string, data?: unknown) {
    this.connectedUsers
      .get(userId)
      ?.forEach((user) => this.server.to(user).emit(message, data));
  }
}
