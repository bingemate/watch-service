import { ApiProperty } from '@nestjs/swagger';
import { PlaylistTypeEnum } from '../playlist-type.enum';

export class PlaylistDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ enum: PlaylistTypeEnum })
  type: string;
}
