import { Entity, PrimaryColumn } from 'typeorm';

@Entity('watch_together_invitations')
export class WatchTogetherInvitationsEntity {
  @PrimaryColumn('uuid')
  userId: string;
  @PrimaryColumn('uuid')
  roomId: string;
}
