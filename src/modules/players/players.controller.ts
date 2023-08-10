import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreatePlayerDto, PlayerDto, PlayersQueryDto } from './dtos';
import { PlayersService } from './players.service';
import { ApiPaginatedResponse, ApiResponse, PaginationDto } from '../../common/dtos';
import { PlayerWithFormattedSalary } from './dtos';

@ApiTags('players')
@Controller('players')
@ApiExtraModels(PlayerWithFormattedSalary, PlayerDto)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  @Get()
  @ApiPaginatedResponse(PlayerWithFormattedSalary)
  findAll(
    @Query() playersQuerDto: PlayersQueryDto,
  ): Promise<PaginationDto<PlayerWithFormattedSalary[]>> {
    const { page, limit } = playersQuerDto;
    return this.playersService.findAll(page, limit);
  } 

  @Post()
  @ApiResponse(PlayerDto)
  @ApiBadRequestResponse()
  create(@Body() createPlayerDto: CreatePlayerDto) {
    return this.playersService.create(createPlayerDto);
  }
}
