import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Player } from '@prisma/client';
import { PaginationDto } from '../../common/dtos';
import { PlayerWithFormattedSalary, UpdatePlayerDto } from './dtos';
import { PrismaService } from '../../common/services/prisma.service';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { FirebaseStorageService } from '../firebase-storage/firebase-storage.service';

@Injectable()
export class PlayersService {
  logger = new Logger(PlayersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebaseStorageService: FirebaseStorageService,
  ) {}
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
      throw new BadRequestException('Error while creating player');
    }
    return player;
  }

  async findOne(id: number): Promise<Player> {
    const player = await this.prisma.player.findUnique({
      where: { id },
    });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    return player;
  }

  async updatePlayerPicture(playerId: number, file: Express.Multer.File) {
    await this.findOne(playerId);

    this.logger.debug(
      `Updating player picture for player ${playerId} with file`,
    );

    const publicUrl = await this.firebaseStorageService.uploadFile(file);

    // Update the player's pictureURl in the database
    await this.prisma.player.update({
      where: { id: playerId },
      data: { pictureURl: publicUrl },
    });

    return 'Photo sauvegardée avec succès';
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    await this.findOne(id);

    try {
      await this.prisma.player.update({
        where: { id },
        data: updatePlayerDto,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Player already exists');
      }
      this.logger.error(error);
      throw new BadRequestException('Error while updating player');
    }

    return 'Informations sauvegardée avec succès';
  }

  async delete(id: number) {
    await this.findOne(id);

    try {
      await this.prisma.player.delete({
        where: { id },
      });
      return 'Joueur supprimé avec succès';
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Error while deleting player');
    }
  }
}
