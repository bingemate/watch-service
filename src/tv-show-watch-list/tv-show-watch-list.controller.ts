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
import { TvShowWatchListService } from './tv-show-watch-list.service';
import { EpisodeWatchListDto } from './dto/episode-watch-list.dto';
import { AddEpisodeWatchlistItemDto } from './dto/add-episode-watchlist-item.dto';
import { UpdateEpisodeWatchlistItemDto } from './dto/update-episode-watchlist-item.dto';
import { EpisodeWatchListItemDto } from './dto/episode-watch-list-item.dto';
import { TvShowWatchListItemEntity } from './tv-show-watch-list-item.entity';
import { TvShowWatchListStatus } from './tv-show-watch-list-status.enum';

@ApiTags('/tv-show-watchlist')
@Controller('/tv-show-watchlist')
export class TvShowWatchListController {
  constructor(private watchListService: TvShowWatchListService) {}

  @ApiOperation({
    description: 'Get a watchlist item by media id',
  })
  @ApiOkResponse({
    type: EpisodeWatchListItemDto,
  })
  @ApiParam({ name: 'tvShowId' })
  @Get('/:tvShowId/item')
  async getUserWatchlistById(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
  ): Promise<TvShowWatchListItemEntity> {
    const userId = headers['user-id'];
    return await this.watchListService.getWatchListItemById(userId, tvShowId);
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
        tvShowId: watchListItem.tvShowId,
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
  @ApiParam({ name: 'tvShowId' })
  @ApiBody({
    type: AddEpisodeWatchlistItemDto,
  })
  @HttpCode(204)
  @Post('/:tvShowId')
  async createWatchListItemStatus(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
    @Body() create: AddEpisodeWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.createWatchListItem({
      userId,
      tvShowId: tvShowId,
      status: TvShowWatchListStatus[create.status],
      viewedEpisodes: create.viewedEpisodes,
    });
  }

  @ApiOperation({
    description: 'Update watchlist entry status',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'tvShowId' })
  @ApiBody({
    type: UpdateEpisodeWatchlistItemDto,
  })
  @HttpCode(204)
  @Put('/:tvShowId')
  async updateWatchListItemStatus(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
    @Body() update: UpdateEpisodeWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.updateWatchListItem(
      {
        userId,
        tvShowId,
      },
      update.status,
    );
  }

  @ApiOperation({ description: 'Delete watch list item' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'tvShowId' })
  @HttpCode(204)
  @Delete('/:tvShowId')
  async deleteWatchListItem(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.deleteWatchListItem(userId, tvShowId);
  }
}
