import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { MovieWatchStatsService } from './movie-watch-stats.service';
import { MovieWatchStatsEntity } from './movie-watch-stats.entity';

@ApiTags('/movie-stats')
@Controller({ path: '/movie-stats' })
export class MovieWatchStatsController {
  constructor(private watchStatsService: MovieWatchStatsService) {}

  @ApiOperation({
    description: "Get user's stats",
  })
  @ApiOkResponse({ type: [MovieWatchStatsEntity] })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @Get('/:userId')
  async getUserStats(
    @Param('userId') userId: string,
  ): Promise<MovieWatchStatsEntity[]> {
    return await this.watchStatsService.getStatsByUserId(userId);
  }
}
