import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('media_history')
export class MediaHistoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  mediaId: string;

  @Column('uuid')
  userId: string;

  @Column('float')
  stoppedAt: number;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  finishedAt?: Date;
}
