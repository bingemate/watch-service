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
import { MoviePlaylistItemsDto } from './dto/movie-playlist-items.dto';
import { CreateMoviePlaylistDto } from './dto/create-movie-playlist.dto';
import { MoviePlaylistIdDto } from './dto/movie-playlist-id.dto';
import { MoviePlaylistDto } from './dto/movie-playlist.dto';
import { AddPlaylistMovieDto } from './dto/add-playlist-movie.dto';
import { MoviePlaylistService } from './movie-playlist.service';
import { MoviePlaylistsDto } from './dto/movie-playlists.dto';

@ApiTags('/movie-playlist')
@Controller('/movie-playlist')
export class MoviePlaylistController {
  constructor(private playlistService: MoviePlaylistService) {}

  @ApiBody({ type: CreateMoviePlaylistDto })
  @ApiCreatedResponse({ type: MoviePlaylistIdDto })
  @HttpCode(201)
  @Post()
  async createPlaylist(
    @Headers() headers,
    @Body() playlistCreationDto: CreateMoviePlaylistDto,
  ): Promise<MoviePlaylistIdDto> {
    const userId = headers['user-id'] as string;
    return {
      id: await this.playlistService.createPlaylist({
        name: playlistCreationDto.name,
        userId,
      }),
    };
  }

  @ApiParam({ name: 'userId', format: 'uuid' })
  @ApiOkResponse({ type: MoviePlaylistsDto })
  @Get('/user/:userId')
  async getPlaylistsByUserId(
    @Param('userId') userId: string,
  ): Promise<MoviePlaylistsDto> {
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
  @ApiOkResponse({ type: MoviePlaylistDto })
  @Get('/:playlistId')
  async getPlaylist(
    @Param('playlistId') playlistId: string,
  ): Promise<MoviePlaylistDto> {
    const playlist = await this.playlistService.getPlaylistsById(playlistId);
    const playlistItems = await this.playlistService.getPlaylistItems(
      playlistId,
    );
    console.log(playlistItems);
    return {
      id: playlist.id,
      name: playlist.name,
      userId: playlist.userId,
      items: playlistItems.map((playlistItem) => ({
        movieId: playlistItem.movieId,
      })),
    };
  }

  @ApiBody({ type: AddPlaylistMovieDto })
  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Patch('/:playlistId')
  async addMediaToPlaylist(
    @Param('playlistId') playlistId: string,
    @Body() addMediaDto: AddPlaylistMovieDto,
  ): Promise<void> {
    await this.playlistService.addMediaToPlaylist(playlistId, addMediaDto);
  }

  @ApiParam({ name: 'playlistId', format: 'uuid' })
  @ApiBody({ type: MoviePlaylistItemsDto })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Put('/:playlistId')
  async updatePlaylist(
    @Param('playlistId') playlistId: string,
    @Body() playlistItemsDto: MoviePlaylistItemsDto,
  ): Promise<void> {
    await this.playlistService.updatePlaylist({
      id: playlistId,
      medias: playlistItemsDto.items.map((item) => ({
        movieId: item.movieId,
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
  @ApiParam({ name: 'movieId' })
  @ApiNoContentResponse()
  @HttpCode(204)
  @Delete('/:playlistId/:movieId')
  async removeMediaFromPlaylist(
    @Param('playlistId') playlistId: string,
    @Param('movieId') movieId: number,
  ): Promise<void> {
    await this.playlistService.removeMedia(playlistId, movieId);
  }
}
