import { ApiProperty } from '@nestjs/swagger';

export class PlaylistDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  name: string;
}
