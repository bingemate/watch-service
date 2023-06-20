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
import { TvShowWatchListDto } from './dto/tv-show-watch-list.dto';
import { AddTvShowWatchlistItemDto } from './dto/add-tv-show-watchlist-item.dto';
import { UpdateTvShowWatchlistItemDto } from './dto/update-tv-show-watchlist-item.dto';
import { TvShowWatchListItemDto } from './dto/tv-show-watch-list-item.dto';
import { TvShowWatchListItemEntity } from './tv-show-watch-list-item.entity';

@ApiTags('/tv-show-watchlist')
@Controller('/tv-show-watchlist')
export class TvShowWatchListController {
  constructor(private watchListService: TvShowWatchListService) {}

  @ApiOperation({
    description: 'Get a watchlist item by media id',
  })
  @ApiOkResponse({
    type: TvShowWatchListItemDto,
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
    type: TvShowWatchListDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @Get('/:userId')
  async getUserWatchList(
    @Param('userId') userId: string,
  ): Promise<TvShowWatchListDto> {
    const watchList = await this.watchListService.getWatchListByUserId(userId);
    return {
      watchListItems: watchList.map((watchListItem) => ({
        tvShowId: watchListItem.tvShowId,
        status: watchListItem.status,
        episodes: watchListItem.episodes.map((episode) => ({
          episodeId: episode.episodeId,
          status: episode.status,
        })),
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
    type: AddTvShowWatchlistItemDto,
  })
  @HttpCode(204)
  @Post('/:tvShowId')
  async createWatchListItemStatus(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
    @Body() create: AddTvShowWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.createTvShowWatchListItem({
      userId,
      tvShowId: tvShowId,
      status: create.status,
      episodes: [],
    });
  }

  @ApiOperation({
    description: 'Create watchlist entry',
  })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: 'Media not found',
  })
  @ApiParam({ name: 'tvShowId' })
  @ApiParam({ name: 'episodeId' })
  @ApiBody({
    type: AddTvShowWatchlistItemDto,
  })
  @HttpCode(204)
  @Post('/:tvShowId/episode/:episodeId')
  async createEpisodeWatchListItemStatus(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
    @Param('episodeId') episodeId: number,
    @Body() create: AddTvShowWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.createEpisodeWatchListItem({
      userId,
      episodeId,
      tvShow: { tvShowId, userId },
      status: create.status,
    });
  }

  @ApiOperation({
    description: 'Update watchlist entry status',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'tvShowId' })
  @ApiBody({
    type: UpdateTvShowWatchlistItemDto,
  })
  @HttpCode(204)
  @Put('/:tvShowId')
  async updateWatchListItemStatus(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
    @Body() update: UpdateTvShowWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.updateTvShowWatchListItem(
      {
        userId,
        tvShowId,
      },
      update.status,
    );
  }

  @ApiOperation({
    description: 'Update watchlist entry status',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'tvShowId' })
  @ApiBody({
    type: UpdateTvShowWatchlistItemDto,
  })
  @HttpCode(204)
  @Put('/:tvShowId/episode/:episodeId')
  async updateEpisodeWatchListItemStatus(
    @Headers() headers,
    @Param('tvShowId') tvShowId: number,
    @Param('episodeId') episodeId: number,
    @Body() update: UpdateTvShowWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.updateEpisodeWatchListItem(
      {
        userId,
        episodeId,
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
    await this.watchListService.deleteTvShowWatchListItem(userId, tvShowId);
  }
}
