import { ApiProperty } from '@nestjs/swagger';

export class EpisodeHistoryDto {
  @ApiProperty()
  episodeId: number;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  stoppedAt: number;
  @ApiProperty()
  viewedAt: Date;
}
