import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviePlaylistItemEntity } from './movie-playlist-item.entity';
import { MoviePlaylistEntity } from './movie-playlist.entity';
import { MoviePlaylistController } from './movie-playlist.controller';
import { MoviePlaylistService } from './movie-playlist.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoviePlaylistItemEntity, MoviePlaylistEntity]),
  ],
  providers: [MoviePlaylistService],
  controllers: [MoviePlaylistController],
  exports: [MoviePlaylistService],
})
export class MoviePlaylistModule {}
