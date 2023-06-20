import { ApiProperty } from '@nestjs/swagger';
import { TvShowWatchListStatus } from '../tv-show-watch-list-status.enum';

export class AddTvShowWatchlistItemDto {
  @ApiProperty({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;
}
