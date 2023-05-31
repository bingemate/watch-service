import { ApiProperty } from '@nestjs/swagger';

export class AddMediaDto {
  @ApiProperty()
  mediaId: number;
  @ApiProperty({ required: false })
  season?: number;
  @ApiProperty({ required: false })
  episode?: number;
}
