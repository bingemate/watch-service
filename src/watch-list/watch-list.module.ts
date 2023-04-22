import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchListItemEntity } from './watch-list-item.entity';
import { WatchListService } from './watch-list.service';
import { WatchListController } from './watch-list.controller';
import { WatchListListener } from './watch-list.listener';

@Module({
  imports: [TypeOrmModule.forFeature([WatchListItemEntity])],
  providers: [WatchListService, WatchListListener],
  controllers: [WatchListController],
  exports: [WatchListService],
})
export class WatchListModule {}
