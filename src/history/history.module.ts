import { Module } from '@nestjs/common';
import { HistoryGateway } from './history.gateway';
import { MovieHistoryModule } from '../movie-history/movie-history.module';
import { EpisodeHistoryModule } from '../episode-history/episode-history.module';

@Module({
  imports: [MovieHistoryModule, EpisodeHistoryModule],
  providers: [HistoryGateway],
  controllers: [],
  exports: [],
})
export class HistoryModule {}
