import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodePlaylistItemEntity } from './episode-playlist-item.entity';
import { EpisodePlaylistEntity } from './episode-playlist.entity';
import { EpisodePlaylistService } from './episode-playlist.service';
import { EpisodePlaylistController } from './episode-playlist.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EpisodePlaylistEntity,
      EpisodePlaylistItemEntity,
    ]),
  ],
  providers: [EpisodePlaylistService],
  controllers: [EpisodePlaylistController],
  exports: [EpisodePlaylistService],
})
export class EpisodePlaylistModule {}
