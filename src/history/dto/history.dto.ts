import { MediaHistoryDto } from './media-history.dto';
import { ApiProperty } from '@nestjs/swagger';

export class HistoryDto {
  @ApiProperty({ type: [MediaHistoryDto] })
  medias: MediaHistoryDto[];
}
