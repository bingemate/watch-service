import { MovieHistoryDto } from './movie-history.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MovieHistoryListDto {
  @ApiProperty({ type: [MovieHistoryDto] })
  medias: MovieHistoryDto[];
}
