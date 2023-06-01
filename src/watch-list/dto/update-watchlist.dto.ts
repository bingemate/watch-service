import { ApiProperty } from '@nestjs/swagger';
import { WatchListStatus } from '../watch-list-status.enum';

export class UpdateWatchlistDto {
  @ApiProperty({ enum: WatchListStatus })
  status: WatchListStatus;
}
