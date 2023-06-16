import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('episode_watch_stats')
export class EpisodeWatchStatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  episodeId: number;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  stoppedAt?: Date;
}
