export interface WatchTogetherRoom {
  id: string;
  ownerId: string;
  joinedSessions: string[];
  invitedUsers: string[];
  mediaIds: number[];
  mediaType: 'tv-shows' | 'movies';
  playlistPosition: number;
  position: number;
  status: WatchTogetherStatus;
}

export enum WatchTogetherStatus {
  PAUSED = 'PAUSED',
  PLAYING = 'PLAYING',
}
