import { ApiProperty } from '@nestjs/swagger';
import { WatchListType } from '../watch-list-type.enum';

export class WatchListItemDto {
  @ApiProperty()
  mediaId: number;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  viewedEpisodes: number;
  @ApiProperty({ enum: ['PLAN_TO_WATCH', 'WATCHING', 'FINISHED', 'ABANDONED'] })
  status: string;
  @ApiProperty({ enum: WatchListType })
  mediaType?: WatchListType;
}
