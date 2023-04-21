import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaHistoryEntity } from './media-history.entity';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { HistoryGateway } from './history.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([MediaHistoryEntity])],
  providers: [HistoryService, HistoryGateway],
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
