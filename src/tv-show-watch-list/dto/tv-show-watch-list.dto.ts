import { TvShowWatchListItemDto } from './tv-show-watch-list-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TvShowWatchListDto {
  @ApiProperty({ type: [TvShowWatchListItemDto] })
  watchListItems: TvShowWatchListItemDto[];
}
