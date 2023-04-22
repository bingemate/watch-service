import { ApiProperty } from '@nestjs/swagger';

export class WatchListItemDto {
  @ApiProperty({ format: 'uuid' })
  mediaId: string;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty({ enum: ['PLAN_TO_WATCH', 'WATCHING', 'FINISHED', 'ABANDONED'] })
  status: string;
}
