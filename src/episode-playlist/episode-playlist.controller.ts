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
import { EpisodePlaylistService } from './episode-playlist.service';
import { EpisodePlaylistItemsDto } from './dto/episode-playlist-items.dto';
import { CreateEpisodePlaylistDto } from './dto/create-episode-playlist.dto';
import { EpisodePlaylistIdDto } from './dto/episode-playlist-id.dto';
import { EpisodePlaylistDto } from './dto/episode-playlist.dto';
import { EpisodePlaylistsDto } from './dto/episode-playlists.dto';
import { AddPlaylistEpisodesDto } from './dto/add-playlist-episodes.dto';

@ApiTags('/episode-playlist')
@Controller('/episode-playlist')
export class EpisodePlaylistController {
  constructor(private playlistService: EpisodePlaylistService) {}

  @ApiBody({ type: CreateEpisodePlaylistDto })
  @ApiCreatedResponse({ type: EpisodePlaylistIdDto })
  @HttpCode(201)
  @Post()
  async createPlaylist(
    @Headers() headers,
    @Body() playlistCreationDto: CreateEpisodePlaylistDto,
  ): Promise<EpisodePlaylistIdDto> {
    const userId = headers['user-id'] as string;
    return {
      id: await this.playlistService.createPlaylist({
        name: playlistCreationDto.name,
        userId,
      }),
    };
  }

  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiOkResponse({ type: EpisodePlaylistsDto })
  @Get('/user/:userId')
  async getPlaylistsByUserId(
    @Param('userId') userId: string,
  ): Promise<EpisodePlaylistsDto> {
    const playlists = await this.playlistService.getPlaylistsByUserId(userId);
    return {
      items: playlists.map((playlist) => ({
        id: playlist.id,
        userId: playlist.userId,
        name: playlist.name,
        items: [],
      })),
    };
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiOkResponse({ type: EpisodePlaylistDto })
  @Get('/:playlistId')
  async getPlaylist(
    @Param('playlistId') playlistId: string,
  ): Promise<EpisodePlaylistDto> {
    const playlist = await this.playlistService.getPlaylistsById(playlistId);
    const playlistItems = await this.playlistService.getPlaylistItems(
      playlistId,
    );
    return {
      id: playlist.id,
      name: playlist.name,
      userId: playlist.userId,
      items: playlistItems.map((playlistItem) => ({
        episodeId: playlistItem.episodeId,
      })),
    };
  }

  @ApiBody({ type: AddPlaylistEpisodesDto })
  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Patch('/:playlistId')
  async addMediaToPlaylist(
    @Param('playlistId') playlistId: string,
    @Body() addMediasDto: AddPlaylistEpisodesDto,
  ): Promise<void> {
    await this.playlistService.addMediasToPlaylist(
      playlistId,
      addMediasDto.episodes,
    );
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiBody({ type: EpisodePlaylistItemsDto })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Put('/:playlistId')
  async updatePlaylist(
    @Param('playlistId') playlistId: string,
    @Body() playlistItemsDto: EpisodePlaylistItemsDto,
  ): Promise<void> {
    await this.playlistService.updatePlaylist({
      id: playlistId,
      medias: playlistItemsDto.items.map((item) => ({
        episodeId: item.episodeId,
      })),
    });
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Delete('/:playlistId')
  async deletePlaylist(@Param('playlistId') playlistId: string): Promise<void> {
    await this.playlistService.deletePlaylist(playlistId);
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiParam({ name: 'episodeId' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Delete('/:playlistId/:episodeId')
  async removeMediaFromPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('episodeId') episodeId: number,
  ): Promise<void> {
    await this.playlistService.removeMedia(playlistId, episodeId);
  }
}
