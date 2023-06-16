import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('movie_history')
export class MovieHistoryEntity {
  @PrimaryColumn()
  movieId: number;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;

  @UpdateDateColumn()
  viewedAt: Date;
}
