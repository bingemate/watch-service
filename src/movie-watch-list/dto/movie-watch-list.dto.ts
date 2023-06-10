import { MovieWatchListItemDto } from './movie-watch-list-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MovieWatchListDto {
  @ApiProperty({ type: [MovieWatchListItemDto] })
  watchListItems: MovieWatchListItemDto[];
}
