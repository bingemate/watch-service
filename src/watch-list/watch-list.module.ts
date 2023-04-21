import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchListItemEntity } from './watch-list-item.entity';
import { WatchListService } from './watch-list.service';
import { WatchListController } from './watch-list.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WatchListItemEntity])],
  providers: [WatchListService],
  controllers: [WatchListController],
  exports: [WatchListService],
})
export class WatchListModule {}
