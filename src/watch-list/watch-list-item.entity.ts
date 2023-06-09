import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WatchListStatus } from './watch-list-status.enum';
import { WatchListType } from './watch-list-type.enum';

@Entity('watch_list_item')
export class WatchListItemEntity {
  @PrimaryColumn()
  mediaId: number;

  @PrimaryColumn({ type: 'uuid' })
  userId: string;

  @Column({
    enum: WatchListStatus,
    nullable: true,
  })
  status: WatchListStatus;

  @Column({ enum: WatchListType })
  mediaType: WatchListType;

  @Column({ nullable: true })
  viewedEpisodes: number;
}
