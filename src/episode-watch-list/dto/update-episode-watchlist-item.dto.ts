import { ApiProperty } from '@nestjs/swagger';
import { EpisodeWatchListStatus } from '../episode-watch-list-status.enum';

export class UpdateEpisodeWatchlistItemDto {
  @ApiProperty({ enum: EpisodeWatchListStatus })
  status: EpisodeWatchListStatus;
}
