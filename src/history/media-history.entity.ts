import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class MediaHistoryEntity {
  @PrimaryColumn('uuid')
  mediaId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;
}
