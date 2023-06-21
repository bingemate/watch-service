import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers } from '@nestjs/common';
import { WatchTogetherService } from '../watch-together/watch-together.service';
import { SessionIdDto } from '../watch-together/dto/session-id.dto';

@ApiTags('/history')
@Controller('/history')
export class HistoryController {
  constructor(private watchTogetherService: WatchTogetherService) {}

  @ApiOperation({
    description: 'Get a session id',
  })
  @ApiOkResponse({
    type: SessionIdDto,
  })
  @Get('session')
  async getSessionId(@Headers() headers): Promise<SessionIdDto> {
    const userId = headers['user-id'];
    return {
      sessionId: await this.watchTogetherService.createSession(userId),
    };
  }
}
