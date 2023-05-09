import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from './history/history.module';
import { WatchListModule } from './watch-list/watch-list.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PlaylistModule } from './playlist/playlist.module';
import { ServiceStatusModule } from './service-status/service-status.module';

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
    }),
    HistoryModule,
    WatchListModule,
    PlaylistModule,
    ServiceStatusModule,
  ],
  providers: [],
})
export class AppModule {}
