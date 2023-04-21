import { ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';
import { WatchListService } from './watch-list.service';

@ApiTags('/watch-list')
@Controller('/watch-list')
export class WatchListController {
  constructor(private watchListService: WatchListService) {}
}
