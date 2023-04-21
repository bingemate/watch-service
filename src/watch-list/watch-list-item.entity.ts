import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WatchListStatus } from './watch-list-status.enum';

@Entity()
export class WatchListItemEntity {
  @PrimaryColumn('uuid')
  mediaId: string;

  @PrimaryColumn('uuid')
  userId: string;

  @Column({ type: 'enum', enum: WatchListStatus })
  status: WatchListStatus;
}
