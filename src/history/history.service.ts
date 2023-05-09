import { Injectable } from '@nestjs/common';
import { MediaHistoryEntity } from './media-history.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(MediaHistoryEntity)
    private readonly mediaHistoryRepository: Repository<MediaHistoryEntity>,
  ) {}

  async getHistoryByUserId(userId: string): Promise<MediaHistoryEntity[]> {
    return await this.mediaHistoryRepository
      .createQueryBuilder()
      .where('MediaHistoryEntity.userId=:userId', { userId })
      .getMany();
  }

  async getHistoryById(id: string): Promise<MediaHistoryEntity> {
    return await this.mediaHistoryRepository.findOne({ where: { id } });
  }

  async createMediaHistory(mediaHistoryEntity: {
    mediaId: string;
    userId: string;
    stoppedAt: number;
    startedAt: Date;
  }): Promise<string> {
    return (await this.mediaHistoryRepository.save(mediaHistoryEntity)).id;
  }

  async updateMediaHistory(mediaHistoryEntity: {
    id: string;
    stoppedAt: number;
    finishedAt?: Date;
  }): Promise<void> {
    await this.mediaHistoryRepository.save(mediaHistoryEntity);
  }

  async deleteMediaHistory(id: string): Promise<void> {
    await this.mediaHistoryRepository.delete({ id });
  }
}
