import { ApiProperty } from '@nestjs/swagger';

export class MediaHistoryDto {
  @ApiProperty({ format: 'uuid' })
  mediaId: string;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  stoppedAt: number;
}
