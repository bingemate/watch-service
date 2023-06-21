import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers } from '@nestjs/common';
import { SessionIdDto } from '../watch-together/dto/session-id.dto';
import { HistoryService } from './history.service';

@ApiTags('/history')
@Controller('/history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

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
      sessionId: await this.historyService.createSession(userId),
    };
  }
}
