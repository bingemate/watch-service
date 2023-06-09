import { ApiProperty } from '@nestjs/swagger';
import { EpisodePlaylistItemDto } from './episode-playlist-item.dto';

export class EpisodePlaylistDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: [EpisodePlaylistItemDto] })
  items: EpisodePlaylistItemDto[];
}
