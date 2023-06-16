import { ApiProperty } from '@nestjs/swagger';
import { TvShowWatchListStatus } from '../tv-show-watch-list-status.enum';

export class UpdateEpisodeWatchlistItemDto {
  @ApiProperty({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;
}
