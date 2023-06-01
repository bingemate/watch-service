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
  Param,
  Headers,
  HttpCode,
  Post,
  Put,
} from '@nestjs/common';
import { WatchListService } from './watch-list.service';
import { WatchListDto } from './dto/watch-list.dto';
import { CreateWatchlistDto } from './dto/create-watchlist.dto';
import { UpdateWatchlistDto } from './dto/update-watchlist.dto';
import { WatchListStatus } from './watch-list-status.enum';

@ApiTags('/watch-list')
@Controller('/watch-list')
export class WatchListController {
  constructor(private watchListService: WatchListService) {}

  @ApiOperation({
    description: 'Retrieve the watch list of a user',
  })
  @ApiOkResponse({
    type: WatchListDto,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @Get('/:userId')
  async getUserWatchList(
    @Param('userId') userId: string,
  ): Promise<WatchListDto> {
    const watchList = await this.watchListService.getWatchListByUserId(userId);
    return {
      watchListItems: watchList.map((watchListItem) => ({
        userId: watchListItem.userId,
        mediaId: watchListItem.mediaId,
        status: watchListItem.status,
        viewedEpisodes: watchListItem.viewedEpisodes,
        mediaType: watchListItem.mediaType,
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
  @ApiParam({ name: 'mediaId' })
  @ApiBody({
    type: CreateWatchlistDto,
  })
  @HttpCode(204)
  @Post('/:mediaId')
  async createWatchListItemStatus(
    @Headers() headers,
    @Param('mediaId') mediaId: number,
    @Body() update: CreateWatchlistDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.createWatchListItem({
      userId,
      mediaId,
      status: WatchListStatus[update.status],
      viewedEpisodes: update.viewedEpisodes,
      mediaType: update.mediaType,
    });
  }

  @ApiOperation({
    description: 'Update watchlist entry status',
  })
  @ApiNoContentResponse()
  @ApiParam({ name: 'mediaId' })
  @ApiBody({
    type: UpdateWatchlistDto,
  })
  @HttpCode(204)
  @Put('/:mediaId')
  async updateWatchListItemStatus(
    @Headers() headers,
    @Param('mediaId') mediaId: number,
    @Body() update: UpdateWatchlistDto,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.updateWatchlist(
      {
        userId,
        mediaId,
      },
      update.status,
    );
  }

  @ApiOperation({ description: 'Delete watch list item' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'mediaId' })
  @HttpCode(204)
  @Delete('/:mediaId')
  async deleteWatchListItem(
    @Headers() headers,
    @Param('mediaId') mediaId: number,
  ): Promise<void> {
    const userId = headers['user-id'];
    await this.watchListService.deleteWatchListItem(userId, mediaId);
  }
}
