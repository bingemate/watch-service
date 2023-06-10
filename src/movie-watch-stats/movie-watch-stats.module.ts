import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieWatchStatsService } from './movie-watch-stats.service';
import { MovieWatchStatsController } from './movie-watch-stats.controller';
import { MovieWatchStatsEntity } from './movie-watch-stats.entity';
import { MovieWatchStatsListener } from './movie-watch-stats.listener';

@Module({
  imports: [TypeOrmModule.forFeature([MovieWatchStatsEntity])],
  providers: [MovieWatchStatsService, MovieWatchStatsListener],
  controllers: [MovieWatchStatsController],
  exports: [MovieWatchStatsService],
})
export class MovieWatchStatsModule {}
