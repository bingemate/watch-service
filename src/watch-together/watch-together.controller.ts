import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Headers } from '@nestjs/common';
import { SessionIdDto } from './dto/session-id.dto';
import { WatchTogetherService } from './watch-together.service';

@ApiTags('/watch-together')
@Controller('/watch-together')
export class WatchTogetherController {
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
      sessionId: await this.watchTogetherService.createSession(
        '5e2a4f62-2d68-4b6b-b8d2-f555caa0734d',
      ),
    };
  }
}
