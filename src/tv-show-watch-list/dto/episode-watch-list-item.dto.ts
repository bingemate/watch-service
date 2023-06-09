import { ApiProperty } from '@nestjs/swagger';
import { TvShowWatchListStatus } from '../tv-show-watch-list-status.enum';

export class EpisodeWatchListItemDto {
  @ApiProperty()
  episodeId: number;
  @ApiProperty({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;
}
