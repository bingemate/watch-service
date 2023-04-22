import { ApiProperty } from '@nestjs/swagger';
import { HistoryUpdateTypeEnum } from '../history-update-type.enum';

export class UpdateMediaHistoryDto {
  @ApiProperty({ format: 'uuid' })
  mediaId: string;
  @ApiProperty({ enum: HistoryUpdateTypeEnum })
  updateType: string;
  @ApiProperty()
  stoppedAt: number;
}
