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
@Controller({ path: '/history' })
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @ApiOperation({ description: "Get current user's history" })
  @ApiOkResponse({
    type: HistoryDto,
  })
  @Get()
  async getUsersHistory(@Headers() headers): Promise<HistoryDto> {
    const userId = headers['user-id'];
    const mediasHistory = await this.historyService.getHistoryByUserId(userId);
    return {
      medias: mediasHistory.map((history) => ({
        mediaId: history.mediaId,
        userId: userId,
        stoppedAt: history.stoppedAt,
      })),
    };
  }

  @ApiOperation({
    description: 'Delete history entry',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', format: 'uuid' })
  @HttpCode(204)
  @Delete('/:id')
  async deleteMediaHistoryById(
    @Param('id') id: string,
    @Headers() headers,
  ): Promise<void> {
    return await this.historyService.deleteMediaHistory(id);
  }
}
