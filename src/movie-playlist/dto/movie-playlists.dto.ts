import { ApiProperty } from '@nestjs/swagger';
import { MoviePlaylistDto } from './movie-playlist.dto';

export class MoviePlaylistsDto {
  @ApiProperty({ type: [MoviePlaylistDto] })
  items: MoviePlaylistDto[];
}
