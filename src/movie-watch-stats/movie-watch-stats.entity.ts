import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie_watch_stats')
export class MovieWatchStatsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column()
  movieId: number;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  stoppedAt?: Date;
}
