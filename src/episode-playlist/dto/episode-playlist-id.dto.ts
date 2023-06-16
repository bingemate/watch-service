import { ApiProperty } from '@nestjs/swagger';

export class EpisodePlaylistIdDto {
  @ApiProperty({ format: 'uuid' })
  id: string;
}
