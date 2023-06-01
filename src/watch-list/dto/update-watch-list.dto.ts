import { WatchListStatus } from '../watch-list-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { WatchListType } from '../watch-list-type.enum';

export class UpdateWatchListDto {
  @ApiProperty({ enum: WatchListStatus })
  status: WatchListStatus;
  @ApiProperty({ enum: WatchListType, required: false })
  mediaType?: WatchListType;
  @ApiProperty()
  viewedEpisodes: number;
}
