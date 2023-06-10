import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('episode_media_history')
export class EpisodeMediaHistoryEntity {
  @PrimaryColumn()
  episodeId: number;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;

  @UpdateDateColumn()
  viewedAt: Date;
}
