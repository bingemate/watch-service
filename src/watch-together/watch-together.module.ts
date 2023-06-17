import { Module } from '@nestjs/common';
import { WatchTogetherGateway } from './watch-together.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchTogetherInvitationsEntity } from './watch-together-invitations.entity';
import { WatchTogetherService } from './watch-together.service';

@Module({
  imports: [TypeOrmModule.forFeature([WatchTogetherInvitationsEntity])],
  providers: [WatchTogetherGateway, WatchTogetherService],
  controllers: [],
  exports: [WatchTogetherService],
})
export class WatchTogetherModule {}
