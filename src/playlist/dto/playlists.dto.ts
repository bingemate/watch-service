import { ApiProperty } from '@nestjs/swagger';
import { PlaylistDto } from './playlist.dto';

export class PlaylistsDto {
  @ApiProperty({ type: [PlaylistDto] })
  items: PlaylistDto[];
}
