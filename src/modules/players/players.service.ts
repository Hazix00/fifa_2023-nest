import { Injectable } from '@nestjs/common';
import { Player } from '@prisma/client';
import { PaginationDto } from '../../common/dtos';
import { PlayerWithFormattedSalary } from './dtos';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class PlayersService {

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
      return formattedSalary.endsWith('.00') ? formattedSalary.slice(0, -3) : formattedSalary;
  }
}
