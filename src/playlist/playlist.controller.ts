import { ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';

@ApiTags('/playlist')
@Controller('/playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Post()
  createPlaylist(): string {
    return '';
  }

  @Get('/user/:userId')
  getPlaylistsByUserId(@Param('userId') userId: string) {}

  @Get('/:playlistId')
  getPlaylistItems(@Param('playlistId') playlistId: string) {}

  @Patch('/:mediaId')
  addMediaToPlaylist(@Param('mediaId') mediaId: string): void {}

  @Put('/:playlistId')
  updatePlaylist(@Param('playlistId') playlistId: string): void {}

  @Delete('/:playlistId')
  deletePlaylist(@Param('playlistId') playlistId: string): void {}
}
