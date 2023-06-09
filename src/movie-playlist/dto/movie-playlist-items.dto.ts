import { ApiProperty } from '@nestjs/swagger';
import { MoviePlaylistItemDto } from './movie-playlist-item.dto';

export class MoviePlaylistItemsDto {
  @ApiProperty({ type: [MoviePlaylistItemDto] })
  items: MoviePlaylistItemDto[];
}
