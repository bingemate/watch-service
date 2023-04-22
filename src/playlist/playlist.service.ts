import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistItemEntity } from './playlist-item.entity';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistItemEntity)
    private readonly playlistRepository: Repository<PlaylistItemEntity>,
  ) {}
}
