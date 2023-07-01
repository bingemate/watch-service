import { ApiProperty } from '@nestjs/swagger';

export class EpisodeHistoryRequestDto {
  @ApiProperty()
  episodeId: number;
  @ApiProperty()
  stoppedAt: number;
}
