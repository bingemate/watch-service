import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WatchStatsService } from './watch-stats.service';
import { WatchStatsEntity } from './watch-stats.entity';

@ApiTags('/stats')
@Controller({ path: '/stats' })
export class WatchStatsController {
  constructor(private watchStatsService: WatchStatsService) {}

  @ApiOperation({
    description: "Get user's stats",
  })
  @ApiOkResponse({ type: [WatchStatsEntity] })
  @ApiParam({ name: 'userId', format: 'uuid' })
  @Get('/:userId')
  async getUserStats(
    @Param('userId') userId: string,
  ): Promise<WatchStatsEntity[]> {
    return await this.watchStatsService.getStatsByuserId(userId);
  }
}
