import { ApiProperty } from '@nestjs/swagger';
import { MovieWatchListStatus } from '../movie-watch-list-status.enum';

export class MovieWatchListItemDto {
  @ApiProperty()
  episodeId: number;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  viewedEpisodes: number;
  @ApiProperty({ enum: MovieWatchListStatus })
  status: MovieWatchListStatus;
}
