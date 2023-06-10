import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
} from '@nestjs/common';
import { EpisodeHistoryListDto } from './dto/episode-history-list.dto';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EpisodeHistoryService } from './episode-history.service';

@ApiTags('/episode-history')
@Controller({ path: '/episode-history' })
export class EpisodeHistoryController {
  constructor(private historyService: EpisodeHistoryService) {}

  @ApiOperation({ description: "Get current user's history" })
  @ApiOkResponse({
    type: EpisodeHistoryListDto,
  })
  @Get()
  async getUsersHistory(@Headers() headers): Promise<EpisodeHistoryListDto> {
    const userId = headers['user-id'];
    const mediasHistory = await this.historyService.getHistoryByUserId(userId);
    return {
      medias: mediasHistory.map((history) => ({
        mediaId: history.episodeId,
        userId: userId,
        stoppedAt: history.stoppedAt,
        viewedAt: history.viewedAt,
      })),
    };
  }

  @ApiOperation({
    description: 'Delete history entry',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'mediaId' })
  @HttpCode(204)
  @Delete('/:mediaId')
  async deleteMediaHistoryById(
    @Param('mediaId') mediaId: number,
    @Headers() headers,
  ): Promise<void> {
    const userId = headers['user-id'] as string;
    return await this.historyService.deleteMediaHistory(mediaId, userId);
  }
}
