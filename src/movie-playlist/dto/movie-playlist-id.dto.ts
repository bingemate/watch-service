import { ApiProperty } from '@nestjs/swagger';

export class MoviePlaylistIdDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
}
