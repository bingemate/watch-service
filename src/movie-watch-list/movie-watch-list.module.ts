import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieWatchListItemEntity } from './movie-watch-list-item.entity';
import { MovieWatchListService } from './movie-watch-list.service';
import { MovieWatchListController } from './movie-watch-list.controller';
import { MovieWatchStatsListener } from './movie-watch-list.listener';
import { MovieHistoryService } from '../movie-history/movie-history.service';
import { MovieHistoryEntity } from '../movie-history/movie-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieWatchListItemEntity, MovieHistoryEntity])],
  providers: [MovieWatchListService, MovieWatchStatsListener, MovieHistoryService],
  controllers: [MovieWatchListController],
  exports: [MovieWatchListService],
})
export class MovieWatchListModule {}
