import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HistoryService {
  private readonly sessions = new Map<string, string>();

  async createSession(userId: string) {
    const sessionId = uuidv4();
    this.sessions.set(sessionId, userId);
    return sessionId;
  }

  getSession(sessionId: string) {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }
}
