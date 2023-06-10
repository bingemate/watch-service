import { MediaHistoryDto } from './media-history.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EpisodeHistoryDto {
  @ApiProperty({ type: [MediaHistoryDto] })
  medias: MediaHistoryDto[];
}
