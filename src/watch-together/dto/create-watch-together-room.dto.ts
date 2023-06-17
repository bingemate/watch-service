export interface CreateWatchTogetherRoomDto {
  invitedUsers: string[];
  mediaIds: number[];
  mediaType: 'tv-shows' | 'movies';
  playlistPosition: number;
}
