import { ApiProperty } from '@nestjs/swagger';
import { MovieWatchListStatus } from '../movie-watch-list-status.enum';

export class AddMovieWatchlistItemDto {
  @ApiProperty({ enum: MovieWatchListStatus })
  status: MovieWatchListStatus;
}
