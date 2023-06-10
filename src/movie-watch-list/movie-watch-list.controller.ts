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
import { MovieWatchListService } from './movie-watch-list.service';
import { MovieWatchListDto } from './dto/movie-watch-list.dto';
import { AddMovieWatchlistItemDto } from './dto/add-movie-watchlist-item.dto';
import { UpdateMovieWatchlistItemDto } from './dto/update-movie-watchlist-item.dto';
import { MovieWatchListItemDto } from './dto/movie-watch-list-item.dto';
import { MovieWatchListItemEntity } from './movie-watch-list-item.entity';
import { MovieWatchListStatus } from './movie-watch-list-status.enum';

@ApiTags('/movie-watchlist')
@Controller('/movie-watchlist')
export class MovieWatchListController {
  constructor(private watchListService: MovieWatchListService) {}

  @ApiOperation({
    description: 'Get a watchlist item by media id',
  })
  @ApiOkResponse({
    type: MovieWatchListItemDto,
  })
  @ApiParam({ name: 'episodeId' })
  @Get('/:episodeId/item')
  async getUserWatchlistById(
    @Headers() headers,
    @Param('episodeId') episodeId: number,
  ): Promise<MovieWatchListItemEntity> {
    const userId = headers['user-id'];
    return await this.watchListService.getWatchListItemById(userId, episodeId);
  }

  @ApiOperation({
    description: 'Retrieve the watch list of a user',
  })
  @ApiOkResponse({
    type: MovieWatchListDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @Get('/:userId')
  async getUserWatchList(
    @Param('userId') userId: string,
  ): Promise<MovieWatchListDto> {
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
    type: AddMovieWatchlistItemDto,
  })
  @HttpCode(204)
  @Post('/:episodeId')
  async createWatchListItemStatus(
    @Headers() headers,
    @Param('episodeId') episodeId: number,
    @Body() update: AddMovieWatchlistItemDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.createWatchListItem({
      userId,
      episodeId: episodeId,
      status: MovieWatchListStatus[update.status],
      viewedEpisodes: update.viewedEpisodes,
    });
  }

  @ApiOperation({
    description: 'Update watchlist entry status',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'episodeId' })
  @ApiBody({
    type: UpdateMovieWatchlistItemDto,
  })
  @HttpCode(204)
  @Put('/:episodeId')
  async updateWatchListItemStatus(
    @Headers() headers,
    @Param('episodeId') episodeId: number,
    @Body() update: UpdateMovieWatchlistItemDto,
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
