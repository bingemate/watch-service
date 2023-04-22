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
  Put,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { WatchListService } from './watch-list.service';
import { WatchListStatus } from './watch-list-status.enum';
import { WatchListDto } from './dto/watch-list.dto';
import { WatchListStatusDto } from './dto/watch-list-status.dto';

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
      })),
    };
  }

  @ApiOperation({
    description: 'Create or update if entry already exist',
  })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({
    description: 'Media not found',
  })
  @ApiParam({ name: 'mediaId', format: 'uuid' })
  @ApiBody({
    type: WatchListStatusDto,
  })
  @HttpCode(204)
  @Put('/:mediaId')
  async upsertWatchListItemStatus(
    @Headers() headers,
    @Param('mediaId') mediaId: string,
    @Body() status: WatchListStatusDto,
  ): Promise<void> {
    const userId = headers.userid;
    await this.watchListService.upsertWatchListItem({
      userId,
      mediaId,
      status: WatchListStatus[status.status],
    });
  }

  @ApiOperation({ description: 'Delete watch list item' })
  @ApiNoContentResponse()
  @ApiParam({ name: 'mediaId', format: 'uuid' })
  @HttpCode(204)
  @Delete('/:mediaId')
  async deleteWatchListItem(
    @Headers() headers,
    @Param('mediaId') mediaId: string,
  ): Promise<void> {
    const userId = headers.userid;
    await this.watchListService.deleteWatchListItem(userId, mediaId);
  }
}
