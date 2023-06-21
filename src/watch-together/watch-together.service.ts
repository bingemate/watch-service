import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { WatchTogetherInvitationsEntity } from './watch-together-invitations.entity';

@Injectable()
export class WatchTogetherService {
  private readonly sessions = new Map<string, string>();
  constructor(
    @InjectRepository(WatchTogetherInvitationsEntity)
    private readonly invitationsEntityRepository: Repository<WatchTogetherInvitationsEntity>,
  ) {}

  async getInvitationsByUserId(
    userId: string,
  ): Promise<WatchTogetherInvitationsEntity[]> {
    return await this.invitationsEntityRepository
      .createQueryBuilder()
      .where({ userId })
      .getMany();
  }

  async createInvitations(invitations: { roomId: string; userId: string }[]) {
    await this.invitationsEntityRepository.save(invitations);
  }

  async deleteInvitationsByRoomId(roomId: string) {
    await this.invitationsEntityRepository.delete({ roomId });
  }

  async createSession(userId: string) {
    const sessionId = uuidv4();
    this.sessions.set(sessionId, userId);
    return sessionId;
  }

  async getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
