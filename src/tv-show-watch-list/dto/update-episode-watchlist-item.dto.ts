import { ApiProperty } from '@nestjs/swagger';
import { TvShowWatchListStatus } from '../episode-watch-list-status.enum';

export class UpdateEpisodeWatchlistItemDto {
  @ApiProperty({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;
}
