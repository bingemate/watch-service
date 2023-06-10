import { ApiProperty } from '@nestjs/swagger';
import { TvShowWatchListStatus } from '../episode-watch-list-status.enum';

export class EpisodeWatchListItemDto {
  @ApiProperty()
  tvShowId: number;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  viewedEpisodes: number;
  @ApiProperty({ enum: TvShowWatchListStatus })
  status: TvShowWatchListStatus;
}
