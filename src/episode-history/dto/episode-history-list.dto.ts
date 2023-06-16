import { EpisodeHistoryDto } from './episode-history.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EpisodeHistoryListDto {
  @ApiProperty({ type: [EpisodeHistoryDto] })
  medias: EpisodeHistoryDto[];
}
