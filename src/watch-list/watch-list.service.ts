import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchListItemEntity } from './watch-list-item.entity';

@Injectable()
export class WatchListService {
  constructor(
    @InjectRepository(WatchListItemEntity)
    private readonly watchListRepository: Repository<WatchListItemEntity>,
  ) {}
}
