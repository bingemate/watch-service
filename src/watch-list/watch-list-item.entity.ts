import { Column, Entity, PrimaryColumn } from 'typeorm';
import { WatchListStatus } from './watch-list-status.enum';
import { WatchListType } from './watch-list-type.enum';

@Entity('watch_list_item')
export class WatchListItemEntity {
  @PrimaryColumn({ name: 'media_id' })
  mediaId: number;

  @PrimaryColumn({ type: 'uuid', name: 'user_id' })
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
