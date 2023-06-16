import { EpisodeWatchListItemDto } from './episode-watch-list-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class EpisodeWatchListDto {
  @ApiProperty({ type: [EpisodeWatchListItemDto] })
  watchListItems: EpisodeWatchListItemDto[];
}
