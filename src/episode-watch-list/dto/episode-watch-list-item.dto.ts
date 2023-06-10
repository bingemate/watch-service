import { ApiProperty } from '@nestjs/swagger';
import { EpisodeWatchListStatus } from '../episode-watch-list-status.enum';

export class EpisodeWatchListItemDto {
  @ApiProperty()
  episodeId: number;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  viewedEpisodes: number;
  @ApiProperty({ enum: EpisodeWatchListStatus })
  status: EpisodeWatchListStatus;
}
