import { ApiProperty } from '@nestjs/swagger';

export class PlaylistIdDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
}
