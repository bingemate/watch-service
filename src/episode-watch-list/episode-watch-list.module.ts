import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeWatchListItemEntity } from './episode-watch-list-item.entity';
import { EpisodeWatchListService } from './episode-watch-list.service';
import { EpisodeWatchListController } from './episode-watch-list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EpisodeWatchListItemEntity])],
  providers: [EpisodeWatchListService],
  controllers: [EpisodeWatchListController],
  exports: [EpisodeWatchListService],
})
export class EpisodeWatchListModule {}
