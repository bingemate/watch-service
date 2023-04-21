import { Controller, Delete, Get, Headers, Param } from '@nestjs/common';
import { HistoryDto } from './dto/history.dto';
import { ApiTags } from '@nestjs/swagger';
import { HistoryService } from './history.service';

@ApiTags('/history')
@Controller('/history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get('/:userId')
  async getUsersHistory(@Param('userId') userId: string): Promise<HistoryDto> {
    const mediasHistory = await this.historyService.getHistoryByUserId(userId);
    return {
      medias: mediasHistory.map((history) => ({
        mediaId: history.mediaId,
        userId: history.userId,
        stoppedAt: history.stoppedAt,
      })),
    };
  }

  @Delete('/:mediaId')
  async deleteUsersMediaHistory(
    @Param('mediaId') mediaId: string,
    @Headers() headers: Headers,
  ): Promise<void> {
    const userId = headers.get('userId');
    return await this.historyService.deleteMediaHistory(mediaId, userId);
  }
}
