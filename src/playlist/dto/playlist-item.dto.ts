import { ApiProperty } from '@nestjs/swagger';

export class PlaylistItemDto {
  @ApiProperty()
  mediaId: number;
  @ApiProperty()
  episode: number;
  @ApiProperty()
  season: number;
}
