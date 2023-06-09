import { ApiProperty } from '@nestjs/swagger';
import { EpisodePlaylistDto } from './episode-playlist.dto';

export class EpisodePlaylistsDto {
  @ApiProperty({ type: [EpisodePlaylistDto] })
  items: EpisodePlaylistDto[];
}
