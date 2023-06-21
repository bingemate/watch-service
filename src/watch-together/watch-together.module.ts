import { Module } from '@nestjs/common';
import { WatchTogetherGateway } from './watch-together.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatchTogetherInvitationsEntity } from './watch-together-invitations.entity';
import { WatchTogetherService } from './watch-together.service';
import { WatchTogetherController } from './watch-together.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WatchTogetherInvitationsEntity])],
  providers: [WatchTogetherGateway, WatchTogetherService],
  controllers: [WatchTogetherController],
  exports: [WatchTogetherService],
})
export class WatchTogetherModule {}
