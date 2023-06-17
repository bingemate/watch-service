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

@WebSocketGateway({ cors: true })
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
    this.rooms.set(roomId, {
      id: roomId,
      ownerId: userId,
      joinedSessions: [client.id],
      invitedUsers: createRoom.invitedUsers,
      playlistPosition: createRoom.playlistPosition,
      mediaIds: createRoom.mediaIds,
      mediaType: createRoom.mediaType,
      position: 0,
      status: WatchTogetherStatus.PAUSED,
    });
    await this.watchTogetherService.createInvitations(
      createRoom.invitedUsers.map((userId) => ({ userId, roomId })),
    );
    createRoom.invitedUsers.forEach((user) => {
      this.emitToUser(user, 'invitedToRoom', roomId);
    });
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
      if (room.joinedSessions.length === 0) {
        this.rooms.delete(roomId);
        await this.watchTogetherService.deleteInvitationByRoomId(roomId);
      }
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
  async addMedia(@ConnectedSocket() client: Socket, mediaId: number) {
    const roomId = this.joinedRoom.get(client.id);
    this.rooms.get(roomId).mediaIds.push(mediaId);
    client.emit('mediaAdded', mediaId);
  }

  @SubscribeMessage('pause')
  async paused(@ConnectedSocket() client: Socket) {
    const roomId = this.joinedRoom.get(client.id);
    const room = this.rooms.get(roomId);
    if (room.joinedSessions.includes(client.id)) {
      room.status = WatchTogetherStatus.PAUSED;
      room.joinedSessions.forEach((user) =>
        this.emitToUser(user, 'roomStatus.pause', room),
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
        this.emitToUser(user, 'roomStatus.play', room),
      );
    }
  }

  @SubscribeMessage('playing')
  async playing(@ConnectedSocket() client: Socket, position: number) {
    const userId = client.handshake.headers['user-id'] as string;
    const roomId = this.joinedRoom.get(client.id);
    const room = this.rooms.get(roomId);
    if (room.joinedSessions.includes(client.id)) {
      if (room.ownerId === userId) {
        room.position = position;
        room.joinedSessions.forEach((user) =>
          this.emitToUser(user, 'roomStatus.playing', room),
        );
      }
    }
  }

  @SubscribeMessage('seek')
  async seek(@ConnectedSocket() client: Socket, position: number) {
    const roomId = this.joinedRoom.get(client.id);
    const room = this.rooms.get(roomId);
    if (room.joinedSessions.includes(client.id)) {
      room.position = position;
      room.joinedSessions.forEach((user) =>
        this.emitToUser(user, 'roomStatus.seek', room),
      );
    }
  }

  private emitToUser(userId: string, message: string, data?: unknown) {
    this.connectedUsers
      .get(userId)
      ?.forEach((user) => this.server.to(user).emit(message, data));
  }
}