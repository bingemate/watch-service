import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('media_history')
export class MediaHistoryEntity {
  @PrimaryColumn()
  mediaId: number;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;

  @UpdateDateColumn()
  viewedAt: Date;
}
