import { ApiProperty } from '@nestjs/swagger';
import { PlaylistTypeEnum } from '../playlist-type.enum';

export class CreatePlaylistDto {
  @ApiProperty()
  name: string;
  @ApiProperty({ enum: PlaylistTypeEnum })
  type: string;
}
