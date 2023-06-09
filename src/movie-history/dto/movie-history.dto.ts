import { ApiProperty } from '@nestjs/swagger';

export class MovieHistoryDto {
  @ApiProperty()
  movieId: number;
  @ApiProperty({ format: 'uuid' })
  userId: string;
  @ApiProperty()
  stoppedAt: number;
  @ApiProperty()
  viewedAt: Date;
}
