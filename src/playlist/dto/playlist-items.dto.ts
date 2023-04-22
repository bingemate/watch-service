import { ApiProperty } from '@nestjs/swagger';
import { PlaylistItemDto } from './playlist-item.dto';

export class PlaylistItemsDto {
  @ApiProperty({ type: [PlaylistItemDto] })
  items: PlaylistItemDto[];
}
