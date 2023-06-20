import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TvShowWatchListItemEntity } from './tv-show-watch-list-item.entity';
import { TvShowWatchListService } from './tv-show-watch-list.service';
import { TvShowWatchListController } from './tv-show-watch-list.controller';
import { EpisodeWatchListItemEntity } from './episode-watch-list-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TvShowWatchListItemEntity,
      EpisodeWatchListItemEntity,
    ]),
  ],
  providers: [TvShowWatchListService],
  controllers: [TvShowWatchListController],
  exports: [TvShowWatchListService],
})
export class TvShowWatchListModule {}
