import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WatchListStatus } from './watch-list-status.enum';

@Entity('watch_list_item')
export class WatchListItemEntity {
  @PrimaryColumn()
  mediaId: number;

  @PrimaryColumn('uuid')
  userId: string;

  @Column({
    type: 'enum',
    enum: WatchListStatus,
    enumName: 'watch_list_status',
  })
  status: WatchListStatus;
}
