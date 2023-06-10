import {
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
import { EpisodeWatchListService } from './episode-watch-list.service';
import { EpisodeWatchListDto } from './dto/episode-watch-list.dto';
import { AddEpisodeWatchlistItemDto } from './dto/add-episode-watchlist-item.dto';
import { UpdateEpisodeWatchlistItemDto } from './dto/update-episode-watchlist-item.dto';
import { EpisodeWatchListItemDto } from './dto/episode-watch-list-item.dto';
import { EpisodeWatchListItemEntity } from './episode-watch-list-item.entity';
import { EpisodeWatchListStatus } from './episode-watch-list-status.enum';

@ApiTags('/episode-watchlist')
@Controller('/episode-watchlist')
export class EpisodeWatchListController {
  constructor(private watchListService: EpisodeWatchListService) {}

  @ApiOperation({
    description: 'Get a watchlist item by media id',
  })
  @ApiOkResponse({
    type: EpisodeWatchListItemDto,
  })
  @ApiParam({ name: 'episodeId' })
  @Get('/:episodeId/item')
  async getUserWatchlistById(
    @Headers() headers,
    @Param('episodeId') episodeId: number,
  ): Promise<EpisodeWatchListItemEntity> {
    const userId = headers['user-id'];
    return await this.watchListService.getWatchListItemById(userId, episodeId);
  }

  @ApiOperation({
    description: 'Retrieve the watch list of a user',
  })
  @ApiOkResponse({
    type: EpisodeWatchListDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @Get('/:userId')
  async getUserWatchList(
    @Param('userId') userId: string,
  ): Promise<EpisodeWatchListDto> {
    const watchList = await this.watchListService.getWatchListByUserId(userId);
    return {
      watchListItems: watchList.map((watchListItem) => ({
        userId: watchListItem.userId,
        episodeId: watchListItem.episodeId,
        status: watchListItem.status,
        viewedEpisodes: watchListItem.viewedEpisodes,
      })),
    };
  }

  @ApiOperation({
    description: 'Create watchlist entry',
  })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: 'Media not found',
  })
  @ApiParam({ name: 'episodeId' })
  @ApiBody({
    type: AddEpisodeWatchlistItemDto,
  })
  @HttpCode(204)
  @Post('/:episodeId')
  async createWatchListItemStatus(
    @Headers() headers,
    @Param('episodeId') episodeId: number,
    @Body() update: AddEpisodeWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.createWatchListItem({
      userId,
      episodeId: episodeId,
      status: EpisodeWatchListStatus[update.status],
      viewedEpisodes: update.viewedEpisodes,
    });
  }

  @ApiOperation({
    description: 'Update watchlist entry status',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'episodeId' })
  @ApiBody({
    type: UpdateEpisodeWatchlistItemDto,
  })
  @HttpCode(204)
  @Put('/:episodeId')
  async updateWatchListItemStatus(
    @Headers() headers,
    @Param('episodeId') episodeId: number,
    @Body() update: UpdateEpisodeWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.updateWatchListItem(
      {
        userId,
        episodeId,
      },
      update.status,
    );
  }

  @ApiOperation({ description: 'Delete watch list item' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'episodeId' })
  @HttpCode(204)
  @Delete('/:episodeId')
  async deleteWatchListItem(
    @Headers() headers,
    @Param('episodeId') episodeId: number,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.deleteWatchListItem(userId, episodeId);
  }
}
