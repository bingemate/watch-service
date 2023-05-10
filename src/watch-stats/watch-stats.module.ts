import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchStatsService } from './watch-stats.service';
import { WatchStatsController } from './watch-stats.controller';
import { WatchStatsEntity } from './watch-stats.entity';
import { WatchStatsListener } from './watch-stats.listener';

@Module({
  imports: [TypeOrmModule.forFeature([WatchStatsEntity])],
  providers: [WatchStatsService, WatchStatsListener],
  controllers: [WatchStatsController],
  exports: [WatchStatsService],
})
export class WatchStatsModule {}
