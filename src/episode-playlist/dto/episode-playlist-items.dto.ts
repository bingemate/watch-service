import { ApiProperty } from '@nestjs/swagger';
import { EpisodePlaylistItemDto } from './episode-playlist-item.dto';

export class EpisodePlaylistItemsDto {
  @ApiProperty({ type: [EpisodePlaylistItemDto] })
  items: EpisodePlaylistItemDto[];
}
