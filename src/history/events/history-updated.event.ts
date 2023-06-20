export interface HistoryUpdatedEvent {
  mediaId: number;
  userId: string;
  sessionId: string;
  stoppedAt?: number;
  tvShowId?: number;
}
