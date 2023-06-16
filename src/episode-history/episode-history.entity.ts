import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('episode_history')
export class EpisodeHistoryEntity {
  @PrimaryColumn()
  episodeId: number;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;

  @UpdateDateColumn()
  viewedAt: Date;
}
