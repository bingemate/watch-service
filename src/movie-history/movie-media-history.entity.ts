import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('movie_media_history')
export class MovieMediaHistoryEntity {
  @PrimaryColumn()
  movieId: number;

  @PrimaryColumn('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;

  @UpdateDateColumn()
  viewedAt: Date;
}
