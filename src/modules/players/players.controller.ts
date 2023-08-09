import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PlayersQueryDto } from './dtos';
import { PlayersService } from './players.service';
import { ApiPaginatedResponse, PaginationDto } from '../../common/dtos';
import { PlayerWithFormattedSalary } from './dtos';

@ApiTags('players')
@Controller('players')
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
}
