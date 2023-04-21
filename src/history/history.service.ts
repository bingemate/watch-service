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

  async upsertMediaHistory(
    mediaHistoryEntity: MediaHistoryEntity,
  ): Promise<void> {
    await this.mediaHistoryRepository.save(mediaHistoryEntity);
  }

  async deleteMediaHistory(mediaId: string, userId: string): Promise<void> {
    await this.mediaHistoryRepository
      .createQueryBuilder()
      .where('MediaHistoryEntity.mediaId=:mediaId', { mediaId })
      .andWhere('MediaHistoryEntity.userId=:userId', { userId })
      .delete()
      .execute();
  }
}
