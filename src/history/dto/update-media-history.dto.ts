import { ApiProperty } from '@nestjs/swagger';

export class UpdateMediaHistoryDto {
  @ApiProperty({ format: 'uuid' })
  mediaId: string;
  @ApiProperty({ enum: ['OPENED_MEDIA', 'UPDATE', 'CLOSED_MEDIA'] })
  updateType: string;
  @ApiProperty()
  stoppedAt: number;
}
