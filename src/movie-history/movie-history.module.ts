import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieHistoryEntity } from './movie-history.entity';
import { MovieHistoryService } from './movie-history.service';
import { MovieHistoryController } from './movie-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MovieHistoryEntity])],
  providers: [MovieHistoryService],
  controllers: [MovieHistoryController],
  exports: [MovieHistoryService],
})
export class MovieHistoryModule {}
