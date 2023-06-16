import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeWatchStatsService } from './episode-watch-stats.service';
import { EpisodeWatchStatsController } from './episode-watch-stats.controller';
import { EpisodeWatchStatsEntity } from './episode-watch-stats.entity';
import { EpisodeWatchStatsListener } from './episode-watch-stats.listener';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeWatchStatsEntity])],
  providers: [EpisodeWatchStatsService, EpisodeWatchStatsListener],
  controllers: [EpisodeWatchStatsController],
  exports: [EpisodeWatchStatsService],
})
export class EpisodeWatchStatsModule {}
