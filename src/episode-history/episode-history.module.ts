import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeMediaHistoryEntity } from './episode-media-history.entity';
import { EpisodeHistoryService } from './episode-history.service';
import { EpisodeHistoryController } from './episode-history.controller';
import { EpisodeWatchStatsListener } from './episode-history.listener';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeMediaHistoryEntity])],
  providers: [EpisodeHistoryService, EpisodeWatchStatsListener],
  controllers: [EpisodeHistoryController],
  exports: [EpisodeHistoryService],
})
export class EpisodeHistoryModule {}
