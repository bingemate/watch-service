import { ApiProperty } from '@nestjs/swagger';

export class MoviePlaylistItemDto {
  @ApiProperty()
  movieId: number;
}
