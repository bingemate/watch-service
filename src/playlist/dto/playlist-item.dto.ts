import { ApiProperty } from '@nestjs/swagger';

export class PlaylistItemDto {
  @ApiProperty()
  mediaId: string;
  @ApiProperty()
  episode: number;
  @ApiProperty()
  season: number;
}
