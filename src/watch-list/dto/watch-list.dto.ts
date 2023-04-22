import { WatchListItemDto } from './watch-list-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class WatchListDto {
  @ApiProperty({ type: [WatchListItemDto] })
  watchListItems: WatchListItemDto[];
}
