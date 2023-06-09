import { ApiProperty } from '@nestjs/swagger';

export class CreateEpisodePlaylistDto {
  @ApiProperty()
  name: string;
}
