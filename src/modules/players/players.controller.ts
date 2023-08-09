import { Controller, Get, Query } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayersQueryDto } from './dtos';
import { PlayersService } from './players.service';
import { ApiPaginatedResponse } from '../../common/dtos';
import { PlayerWithFormattedSalary } from './dtos';

@ApiTags('players')
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}
  @Get()
  @ApiResponse({
    status: 200,
    type: ApiPaginatedResponse(PlayerWithFormattedSalary),
  })
  findAll(
    @Query() playersQuerDto: PlayersQueryDto,
  ) {
    const { page, limit } = playersQuerDto;
    return this.playersService.findAll(page, limit);
  }
}
