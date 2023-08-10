import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import {
  CreatePlayerDto,
  PlayerDto,
  PlayersQueryDto,
  UpdatePlayerDto,
} from './dtos';
import { PlayersService } from './players.service';
import {
  ApiPaginatedResponse,
  ApiResponse,
  ApiResponseDto,
} from '../../common/dtos';
import { PlayerWithFormattedSalary } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('players')
@Controller('players')
@ApiExtraModels(PlayerWithFormattedSalary, PlayerDto)
export class PlayersController {
  logger = new Logger(PlayersController.name);
  constructor(private readonly playersService: PlayersService) {}
  @Get()
  @ApiPaginatedResponse(PlayerWithFormattedSalary)
  @ApiInternalServerErrorResponse()
  findAll(@Query() playersQueryDto: PlayersQueryDto) {
    const { page, limit } = playersQueryDto;
    return this.playersService.findAll(page, limit);
  }

  @Post()
  @ApiResponse(PlayerDto)
  @ApiConflictResponse({
    description: 'Player already exists with the same firstname and lastname',
  })
  @ApiBadRequestResponse()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }

  @Put(':id')
  @ApiResponse(String)
  @ApiNotFoundResponse({ description: 'Player not found' })
  @ApiConflictResponse({
    description: 'Player already exists with the same firstname and lastname',
  })
  @ApiBadRequestResponse({ description: 'Error while updating player' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  update(@Param('id') id: number, @Body() updatePlayerDto: UpdatePlayerDto) {
    return this.playersService.update(id, updatePlayerDto);
  }

  @Put(':id/update-player-picture')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse(String)
  @ApiNotFoundResponse({ description: 'Player not found' })
  @ApiInternalServerErrorResponse({
    description: 'Error while updating player picture',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updatePlayerPicture(
    @Param('id') playerId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.debug(
      `Updating player picture for player ${playerId} with file`,
    );

    return this.playersService.updatePlayerPicture(playerId, file);
  }
}
