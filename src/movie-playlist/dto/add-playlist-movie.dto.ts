import { ApiProperty } from '@nestjs/swagger';

export class AddPlaylistMovieDto {
  @ApiProperty()
  movieId: number;
}
