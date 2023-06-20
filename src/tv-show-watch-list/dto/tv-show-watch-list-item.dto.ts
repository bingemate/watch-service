import { ApiProperty } from '@nestjs/swagger';
import { TvShowWatchListStatus } from '../tv-show-watch-list-status.enum';
import { EpisodeWatchListItemDto } from './episode-watch-list-item.dto';

export class TvShowWatchListItemDto {
  @ApiProperty()
  tvShowId: number;
  @ApiProperty({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;
  @ApiProperty({ enum: [EpisodeWatchListItemDto] })
  episodes: EpisodeWatchListItemDto[];
}
