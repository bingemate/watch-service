import { ApiProperty } from '@nestjs/swagger';

export class CreateMoviePlaylistDto {
  @ApiProperty()
  name: string;
}
