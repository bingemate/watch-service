import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeHistoryEntity } from './episode-history.entity';
import { EpisodeHistoryService } from './episode-history.service';
import { EpisodeHistoryController } from './episode-history.controller';
import { EpisodeWatchStatsListener } from './episode-history.listener';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeHistoryEntity])],
  providers: [EpisodeHistoryService, EpisodeWatchStatsListener],
  controllers: [EpisodeHistoryController],
  exports: [EpisodeHistoryService],
})
export class EpisodeHistoryModule {}
