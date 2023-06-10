import { ApiProperty } from '@nestjs/swagger';
import { EpisodeWatchListStatus } from '../episode-watch-list-status.enum';

export class AddEpisodeWatchlistItemDto {
  @ApiProperty({ enum: EpisodeWatchListStatus })
  status: EpisodeWatchListStatus;
  @ApiProperty()
  viewedEpisodes: number;
}
