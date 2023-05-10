import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('media_history')
export class MediaHistoryEntity {
  @PrimaryColumn('uuid')
  mediaId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
