import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
} from '@nestjs/common';
import { MovieHistoryListDto } from './dto/movie-history-list.dto';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MovieHistoryService } from './movie-history.service';

@ApiTags('/movie-history')
@Controller({ path: '/movie-history' })
export class MovieHistoryController {
  constructor(private historyService: MovieHistoryService) {}

  @ApiOperation({ description: "Get current user's history" })
  @ApiOkResponse({
    type: MovieHistoryListDto,
  })
  @Get()
  async getUsersHistory(@Headers() headers): Promise<MovieHistoryListDto> {
    const userId = headers['user-id'];
    const mediasHistory = await this.historyService.getHistoryByUserId(userId);
    return {
      medias: mediasHistory.map((history) => ({
        mediaId: history.movieId,
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
  @ApiParam({ name: 'movieId' })
  @HttpCode(204)
  @Delete('/:movieId')
  async deleteMediaHistoryById(
    @Param('movieId') movieId: number,
    @Headers() headers,
  ): Promise<void> {
    const userId = headers['user-id'] as string;
    return await this.historyService.deleteMediaHistory(movieId, userId);
  }
}
