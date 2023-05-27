import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('watch_stats')
export class WatchStatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  mediaId: number;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  stoppedAt?: Date;
}
