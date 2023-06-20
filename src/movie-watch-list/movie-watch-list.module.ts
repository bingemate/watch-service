import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieWatchListItemEntity } from './movie-watch-list-item.entity';
import { MovieWatchListService } from './movie-watch-list.service';
import { MovieWatchListController } from './movie-watch-list.controller';
import { MovieWatchStatsListener } from './movie-watch-list.listener';

@Module({
  imports: [TypeOrmModule.forFeature([MovieWatchListItemEntity])],
  providers: [MovieWatchListService, MovieWatchStatsListener],
  controllers: [MovieWatchListController],
  exports: [MovieWatchListService],
})
export class MovieWatchListModule {}
