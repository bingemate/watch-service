import { ApiProperty } from '@nestjs/swagger';

export class AddPlaylistEpisodeDto {
  @ApiProperty()
  episodeId: number;
}
