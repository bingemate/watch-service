import { ApiProperty } from '@nestjs/swagger';
import { MoviePlaylistItemDto } from './movie-playlist-item.dto';

export class MoviePlaylistDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: [MoviePlaylistItemDto] })
  items: MoviePlaylistItemDto[];
}
