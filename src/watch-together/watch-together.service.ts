import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchTogetherInvitationsEntity } from './watch-together-invitations.entity';

@Injectable()
export class WatchTogetherService {
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
}
