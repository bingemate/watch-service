import { ApiProperty } from '@nestjs/swagger';
import { HistoryUpdateTypeEnum } from '../history-update-type.enum';

export class UpdateHistoryDto {
  @ApiProperty({ enum: HistoryUpdateTypeEnum })
  watchStatus: HistoryUpdateTypeEnum;
  @ApiProperty()
  stoppedAt: number;
}
