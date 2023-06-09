import { ApiProperty } from '@nestjs/swagger';

export class EpisodePlaylistItemDto {
  @ApiProperty()
  episodeId: number;
}
