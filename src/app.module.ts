import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EpisodeHistoryModule } from './episode-history/episode-history.module';
import { EpisodeWatchListModule } from './episode-watch-list/episode-watch-list.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EpisodePlaylistModule } from './episode-playlist/episode-playlist.module';
import { ServiceStatusModule } from './service-status/service-status.module';
import { EpisodeWatchStatsModule } from './episode-watch-stats/episode-watch-stats.module';
import { MoviePlaylistModule } from './movie-playlist/movie-playlist.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MovieWatchStatsModule } from './movie-watch-stats/movie-watch-stats.module';
import { MovieHistoryModule } from './movie-history/movie-history.module';
import { HistoryModule } from './history/history.module';
import { MovieWatchListModule } from './movie-watch-list/movie-watch-list.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
      namingStrategy: new SnakeNamingStrategy(),
    }),
    EpisodeHistoryModule,
    MovieHistoryModule,
    HistoryModule,
    EpisodeWatchListModule,
    MovieWatchListModule,
    EpisodePlaylistModule,
    MoviePlaylistModule,
    EpisodeWatchStatsModule,
    MovieWatchStatsModule,
    ServiceStatusModule,
  ],
  providers: [],
})
export class AppModule {}
