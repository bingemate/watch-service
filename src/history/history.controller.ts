import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
} from '@nestjs/common';
import { HistoryDto } from './dto/history.dto';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { HistoryService } from './history.service';

@ApiTags('/history')
@Controller('/history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @ApiOperation({ description: "Get current user's history" })
  @ApiOkResponse({
    type: HistoryDto,
  })
  @Get()
  async getUsersHistory(@Headers() headers): Promise<HistoryDto> {
    const userId = headers.userid;
    const mediasHistory = await this.historyService.getHistoryByUserId(userId);
    console.log(userId);
    return {
      medias: mediasHistory.map((history) => ({
        mediaId: history.mediaId,
        userId: userId,
        stoppedAt: history.stoppedAt,
      })),
    };
  }

  @ApiOperation({
    description: 'Delete history entry of current user',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'mediaId', format: 'uuid' })
  @HttpCode(204)
  @Delete('/:mediaId')
  async deleteUsersMediaHistory(
    @Param('mediaId') mediaId: string,
    @Headers() headers,
  ): Promise<void> {
    const userId = headers.userid;
    return await this.historyService.deleteMediaHistory(mediaId, userId);
  }
}
