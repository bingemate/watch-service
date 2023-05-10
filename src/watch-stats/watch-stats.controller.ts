import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { WatchStatsService } from './watch-stats.service';

@ApiTags('/history')
@Controller({ path: '/history' })
export class WatchStatsController {
  constructor(private watchStatsService: WatchStatsService) {}
}
