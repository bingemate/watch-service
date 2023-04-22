import { WatchListStatus } from '../watch-list-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class WatchListStatusDto {
  @ApiProperty({ enum: WatchListStatus })
  status: string;
}
