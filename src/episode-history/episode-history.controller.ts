import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { EpisodeHistoryListDto } from './dto/episode-history-list.dto';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EpisodeHistoryService } from './episode-history.service';
import { EpisodeHistoryDto } from './dto/episode-history.dto';
import { EpisodeHistoryRequestDto } from './dto/episode-history-request.dto';

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
        episodeId: history.episodeId,
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

  @ApiOperation({
    description: 'Get history entry',
  })
  @ApiParam({ name: 'mediaId' })
  @ApiOkResponse({
    type: EpisodeHistoryDto,
  })
  @Get('/:mediaId')
  async getMediaHistoryById(
    @Param('mediaId') mediaId: number,
    @Headers() headers,
  ): Promise<EpisodeHistoryDto> {
    const userId = headers['user-id'] as string;
    const history = await this.historyService.getHistory(userId, mediaId);
    if (!history) {
      return null;
    }
    return {
      episodeId: history.episodeId,
      userId: userId,
      stoppedAt: history.stoppedAt,
      viewedAt: history.viewedAt,
    };
  }

  @ApiOperation({
    description: 'Create history entry',
  })
  @ApiOkResponse()
  @ApiBody({
    type: EpisodeHistoryRequestDto,
  })
  @Post()
  async createMediaHistory(
    @Headers() headers,
    @Body() body: EpisodeHistoryRequestDto,
  ): Promise<void> {
    const userId = headers['user-id'] as string;
    await this.historyService.createEpisodeHistory({
      episodeId: body.episodeId,
      userId: userId,
      stoppedAt: body.stoppedAt,
    });
  }

  @ApiOperation({
    description: 'Update history entry',
  })
  @ApiOkResponse()
  @ApiBody({
    type: EpisodeHistoryRequestDto,
  })
  @Put()
  async updateMediaHistory(
    @Headers() headers,
    @Body() body: EpisodeHistoryRequestDto,
  ): Promise<void> {
    const userId = headers['user-id'] as string;
    await this.historyService.updateEpisodeHistory(
      userId,
      body.episodeId,
      body.stoppedAt,
    );
  }

  @ApiOperation({
    description: 'Get history entry list',
  })
  @ApiOkResponse({
    type: EpisodeHistoryListDto,
  })
  @Post('/list')
  async getMediaHistoryList(
    @Headers() headers,
    @Body() mediaList: number[],
  ): Promise<EpisodeHistoryListDto> {
    const userId = headers['user-id'] as string;
    const historyList = await this.historyService.getHistoryList(
      userId,
      mediaList,
    );
    return {
      medias: historyList.map((history) => ({
        episodeId: history.episodeId,
        userId: userId,
        stoppedAt: history.stoppedAt,
        viewedAt: history.viewedAt,
      })),
    };
  }
}
