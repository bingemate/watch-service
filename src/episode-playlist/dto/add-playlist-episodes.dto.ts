import { ApiProperty } from '@nestjs/swagger';
import { AddPlaylistEpisodeDto } from './add-playlist-episode.dto';

export class AddPlaylistEpisodesDto {
  @ApiProperty()
  episodes: AddPlaylistEpisodeDto[];
}
