import { ApiProperty } from '@nestjs/swagger';
import { HistoryUpdateTypeEnum } from '../history-update-type.enum';

export class UpdateMediaHistoryDto {
  @ApiProperty({ enum: HistoryUpdateTypeEnum })
  watchStatus: HistoryUpdateTypeEnum;
  @ApiProperty()
  stoppedAt: number;
}
