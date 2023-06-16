import { ApiProperty } from '@nestjs/swagger';
import { MovieWatchListStatus } from '../movie-watch-list-status.enum';

export class MovieWatchListItemDto {
  @ApiProperty()
  movieId: number;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty({ enum: MovieWatchListStatus })
  status: MovieWatchListStatus;
}
