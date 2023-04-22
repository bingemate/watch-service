import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { PlaylistItemsDto } from './dto/playlist-items.dto';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { PlaylistsDto } from './dto/playlists.dto';

@ApiTags('/playlist')
@Controller('/playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @ApiBody({ type: PlaylistItemsDto })
  @ApiCreatedResponse({ type: String })
  @HttpCode(201)
  @Post()
  async createPlaylist(
    @Headers() headers,
    playlistCreationDto: CreatePlaylistDto,
  ): Promise<string> {
    const userId = headers.userid as string;
    return await this.playlistService.createPlaylist({
      name: playlistCreationDto.name,
      userId,
    });
  }

  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiOkResponse({ type: PlaylistsDto })
  @Get('/user/:userId')
  async getPlaylistsByUserId(
    @Param('userId') userId: string,
  ): Promise<PlaylistsDto> {
    const playlists = await this.playlistService.getPlaylistsByUserId(userId);
    return {
      items: playlists.map((playlist) => ({
        id: playlist.id,
        userId: playlist.userId,
        name: playlist.name,
      })),
    };
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiOkResponse({ type: PlaylistItemsDto })
  @Get('/:playlistId')
  async getPlaylistItems(
    @Param('playlistId') playlistId: string,
  ): Promise<PlaylistItemsDto> {
    const playlistItems = await this.playlistService.getPlaylistItems(
      playlistId,
    );
    return {
      items: playlistItems.map((playlistItem) => ({
        mediaId: playlistItem.mediaId,
      })),
    };
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiParam({ name: 'mediaId', format: 'uuid' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Patch('/:playlistId/:mediaId')
  async addMediaToPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('mediaId') mediaId: string,
  ): Promise<void> {
    await this.playlistService.addMediaToPlaylist(playlistId, mediaId);
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiBody({ type: PlaylistItemsDto })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Put('/:playlistId')
  async updatePlaylist(
    @Param('playlistId') playlistId: string,
    playlistItemsDto: PlaylistItemsDto,
  ): Promise<void> {
    await this.playlistService.updatePlaylist({
      id: playlistId,
      medias: playlistItemsDto.items.map((item) => ({ mediaId: item.mediaId })),
    });
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Delete('/:playlistId')
  async deletePlaylist(@Param('playlistId') playlistId: string): Promise<void> {
    await this.playlistService.deletePlaylist(playlistId);
  }
}
