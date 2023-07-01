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
import { MovieHistoryListDto } from './dto/movie-history-list.dto';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MovieHistoryService } from './movie-history.service';
import { MovieHistoryDto } from './dto/movie-history.dto';
import { MovieHistoryRequestDto } from './dto/movie-history-request.dto';

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
        movieId: history.movieId,
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

  @ApiOperation({
    description: 'Get history entry',
  })
  @ApiOkResponse()
  @ApiParam({ name: 'movieId' })
  @Get('/:movieId')
  async getMediaHistoryById(
    @Param('movieId') movieId: number,
    @Headers() headers,
  ): Promise<MovieHistoryDto> {
    const userId = headers['user-id'] as string;
    const history = await this.historyService.getHistory(userId, movieId);
    if (!history) {
      return null;
    }
    return {
      movieId: history.movieId,
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
    type: MovieHistoryRequestDto,
  })
  @Post()
  async createMediaHistory(
    @Headers() headers,
    @Body() body: MovieHistoryRequestDto,
  ): Promise<void> {
    const userId = headers['user-id'] as string;
    return await this.historyService.createMovieHistory({
      movieId: body.movieId,
      userId: userId,
      stoppedAt: body.stoppedAt,
    });
  }

  @ApiOperation({
    description: 'Update history entry',
  })
  @ApiOkResponse()
  @ApiBody({
    type: MovieHistoryRequestDto,
  })
  @Put()
  async updateMediaHistory(
    @Headers() headers,
    @Body() body: MovieHistoryRequestDto,
  ): Promise<void> {
    const userId = headers['user-id'] as string;
    return await this.historyService.updateMovieHistory(
      userId,
      body.movieId,
      body.stoppedAt,
    );
  }
}
