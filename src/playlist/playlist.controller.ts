import {
  ApiBody,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
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
import { PlaylistIdDto } from './dto/playlist-id.dto';
import { PlaylistTypeEnum } from './playlist-type.enum';

@ApiTags('/playlist')
@Controller('/playlist')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @ApiBody({ type: CreatePlaylistDto })
  @ApiCreatedResponse({ type: PlaylistIdDto })
  @HttpCode(201)
  @Post()
  async createPlaylist(
    @Headers() headers,
    @Body() playlistCreationDto: CreatePlaylistDto,
  ): Promise<PlaylistIdDto> {
    const userId = headers['user-id'] as string;
    return {
      id: await this.playlistService.createPlaylist({
        name: playlistCreationDto.name,
        type: PlaylistTypeEnum[playlistCreationDto.type],
        userId,
      }),
    };
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
        type: playlist.type,
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
    @Body() playlistItemsDto: PlaylistItemsDto,
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
