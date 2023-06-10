import { ApiProperty } from '@nestjs/swagger';
import { TvShowWatchListStatus } from '../tv-show-watch-list-status.enum';

export class AddEpisodeWatchlistItemDto {
  @ApiProperty({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;
  @ApiProperty()
  viewedEpisodes: number;
}
