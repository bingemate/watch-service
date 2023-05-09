import { ApiProperty } from '@nestjs/swagger';
import { HistoryUpdateTypeEnum } from '../history-update-type.enum';

export class UpdateMediaHistoryDto {
  @ApiProperty({ enum: HistoryUpdateTypeEnum })
  updateType: string;
  @ApiProperty()
  stoppedAt: number;
}
