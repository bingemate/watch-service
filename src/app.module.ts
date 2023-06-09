import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from './history/history.module';
import { WatchListModule } from './watch-list/watch-list.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EpisodePlaylistModule } from './episode-playlist/episode-playlist.module';
import { ServiceStatusModule } from './service-status/service-status.module';
import { WatchStatsModule } from './watch-stats/watch-stats.module';
import { MoviePlaylistModule } from './movie-playlist/movie-playlist.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
    HistoryModule,
    WatchListModule,
    EpisodePlaylistModule,
    MoviePlaylistModule,
    ServiceStatusModule,
    WatchStatsModule,
  ],
  providers: [],
})
export class AppModule {}
