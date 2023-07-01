import { ApiProperty } from '@nestjs/swagger';

export class MovieHistoryRequestDto {
  @ApiProperty()
  movieId: number;
  @ApiProperty()
  stoppedAt: number;
}
