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

@WebSocketGateway({ namespace: 'watch-together', cors: true })
export class WatchTogetherGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  connectedUsers = new Map<string, string[]>();
  joinedRoom = new Map<string, string>();
  rooms = new Map<string, WatchTogetherRoom>();

  constructor(private watchTogetherService: WatchTogetherService) {}

  handleConnection(client: Socket) {
    this.connectedUsers.set(client.handshake.headers['user-id'] as string, [
      client.id,
    ]);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoom: CreateWatchTogetherRoomDto,
  ): Promise<void> {
    const roomId = uuidv4();
    const userId = client.handshake.headers['user-id'] as string;
    const room = {
      id: roomId,
      ownerId: userId,
      joinedSessions: [client.id],
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
      this.emitToUser(user, 'invitedToRoom', roomId);
    });
    client.emit('roomStatus', room);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ): Promise<void> {
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
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(@ConnectedSocket() client: Socket) {
    const roomId = this.joinedRoom.get(client.id);
    if (roomId) {
      this.joinedRoom.delete(client.id);
      const room = this.rooms.get(roomId);
      room.joinedSessions = room.joinedSessions.filter(
        (user) => user !== client.id,
      );
      await this.deleteRoom(room);
    }
  }

  @SubscribeMessage('getRooms')
  async getRooms(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.headers['user-id'] as string;
    const rooms = (
      await this.watchTogetherService.getInvitationsByUserId(userId)
    ).map((invitation) => this.rooms.get(invitation.roomId));
    client.emit('rooms', rooms);
  }

  @SubscribeMessage('addMedia')
  async addMedia(
    @ConnectedSocket() client: Socket,
    @MessageBody() mediaId: number,
  ) {
    const roomId = this.joinedRoom.get(client.id);
    const room = this.rooms.get(roomId);
    if (room && room.joinedSessions.includes(client.id)) {
      room.mediaIds.push(mediaId);
      room.joinedSessions.forEach((user) =>
        this.server.to(user).emit('roomStatus', room),
      );
    }
  }

  @SubscribeMessage('pause')
  async paused(@ConnectedSocket() client: Socket) {
    const roomId = this.joinedRoom.get(client.id);
    const room = this.rooms.get(roomId);
    if (room && room.joinedSessions.includes(client.id)) {
      room.status = WatchTogetherStatus.PAUSED;
      room.joinedSessions.forEach((user) =>
        this.server.to(user).emit('roomStatus', room),
      );
    }
  }

  @SubscribeMessage('play')
  async play(@ConnectedSocket() client: Socket) {
    const roomId = this.joinedRoom.get(client.id);
    const room = this.rooms.get(roomId);
    if (room.joinedSessions.includes(client.id)) {
      room.status = WatchTogetherStatus.PLAYING;
      room.joinedSessions.forEach((user) =>
        this.server.to(user).emit('roomStatus', room),
      );
    }
  }

  @SubscribeMessage('playing')
  async playing(
    @ConnectedSocket() client: Socket,
    @MessageBody() position: number,
  ) {
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
  }

  @SubscribeMessage('seek')
  async seek(
    @ConnectedSocket() client: Socket,
    @MessageBody() position: number,
  ) {
    const roomId = this.joinedRoom.get(client.id);
    const room = this.rooms.get(roomId);
    if (room.joinedSessions.includes(client.id)) {
      room.position = position;
      room.joinedSessions.forEach((user) =>
        this.server.to(user).emit('roomStatus', room),
      );
    }
  }

  @SubscribeMessage('changeMedia')
  async changeMedia(
    @ConnectedSocket() client: Socket,
    @MessageBody() playlistPosition: number,
  ) {
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
  }

  private async deleteRoom(room: WatchTogetherRoom) {
    if (room.joinedSessions.length === 0) {
      this.rooms.delete(room.id);
      await this.watchTogetherService.deleteInvitationsByRoomId(room.id);
      for (const user of room.invitedUsers) {
        this.emitToUser(
          user,
          'rooms',
          await this.watchTogetherService.getInvitationsByUserId(user),
        );
      }
    }
  }

  private emitToUser(userId: string, message: string, data?: unknown) {
    this.connectedUsers
      .get(userId)
      ?.forEach((user) => this.server.to(user).emit(message, data));
  }
}
