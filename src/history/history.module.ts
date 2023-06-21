import { Module } from '@nestjs/common';
import { HistoryGateway } from './history.gateway';
import { MovieHistoryModule } from '../movie-history/movie-history.module';
import { EpisodeHistoryModule } from '../episode-history/episode-history.module';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [MovieHistoryModule, EpisodeHistoryModule],
  providers: [HistoryGateway, HistoryService],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
