import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EpisodeWatchStatsService } from './episode-watch-stats.service';
import { EpisodeWatchStatsEntity } from './episode-watch-stats.entity';

@ApiTags('/episode-stats')
@Controller({ path: '/episode-stats' })
export class EpisodeWatchStatsController {
  constructor(private watchStatsService: EpisodeWatchStatsService) {}

  @ApiOperation({
    description: "Get user's stats",
  })
  @ApiOkResponse({ type: [EpisodeWatchStatsEntity] })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @Get('/:userId')
  async getUserStats(
    @Param('userId') userId: string,
  ): Promise<EpisodeWatchStatsEntity[]> {
    return await this.watchStatsService.getStatsByUserId(userId);
  }
}
