import { UpdateMediaHistoryTypeDto } from './update-media-history-type.dto';

export interface UpdateMediaHistoryDto {
  mediaId: string;
  updateType: UpdateMediaHistoryTypeDto;
  stoppedAt: number;
}
