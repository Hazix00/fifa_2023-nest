import { BadRequestException, ConflictException, Injectable, Logger } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PaginationDto } from '../../common/dtos';
import { PlayerWithFormattedSalary } from './dtos';
import { PrismaService } from '../../common/services/prisma.service';
import { CreatePlayerDto } from './dtos/create-player.dto';

@Injectable()
export class PlayersService {
  logger = new Logger(PlayersService.name);
  constructor(private readonly prisma: PrismaService) {}
  async findAll(
    page: number,
    limit: number,
  ): Promise<PaginationDto<PlayerWithFormattedSalary[]>> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.player.findMany({
        skip,
        take: limit,
      }),
      this.prisma.player.count(),
    ]);

    const formattedData = data.map((player) => ({
      ...player,
      salary: this.formatSalary(player),
    }));

    return { data: formattedData, page, limit, total };
  }

  private formatSalary(player: Player): string {
    if (player.salary >= 1000000) {
      return `${this.toFixedTwo(player.salary / 1000000)} M${player.devise}`;
    } else if (player.salary >= 1000) {
      return `${this.toFixedTwo(player.salary / 1000)} K${player.devise}`;
    } else {
      return `${player.salary} ${player.devise}`;
    }
  }

  private toFixedTwo(salary: number): string {
    const formattedSalary = salary.toFixed(2);
    return formattedSalary.endsWith('.00')
      ? formattedSalary.slice(0, -3)
      : formattedSalary;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    let player: Player;
    try {
      player = await this.prisma.player.create({
        data: createPlayerDto,
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Player already exists');
      }
      this.logger.error(e);
      throw new BadRequestException('Something went wrong');
    }
    return player;
  }
}
