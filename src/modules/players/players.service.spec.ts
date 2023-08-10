import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { playerStub, playersStub } from './test/stubs/players.stubs';
import { PrismaService } from '../../common/services/prisma.service';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('PlayersService', () => {
  let playersService: PlayersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
        {
          provide: PrismaService,
          useValue: {
            player: {
              findMany: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    playersService = module.get(PlayersService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(playersService).toBeDefined();
  });
  describe('when findAll is called', () => {
    it('then findAll should be defined', () => {
      expect(playersService.findAll).toBeDefined();
    });
    it('then return paginated football players with formatted salaries', async () => {
      // Use your stub data for the mock implementation
      const mockPlayers = playersStub().slice(0, 6);
      const mockTotal = mockPlayers.length;
      (prismaService.player.findMany as jest.Mock).mockResolvedValue(
        mockPlayers,
      );
      (prismaService.player.count as jest.Mock).mockResolvedValue(mockTotal);

      const page = 1;
      const limit = 6;

      const result = await playersService.findAll(page, limit);

      // Assertions
      expect(prismaService.player.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.player.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
      });
      expect(prismaService.player.count).toHaveBeenCalledTimes(1);

      expect(result.data.length).toBe(limit);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.total).toBe(mockTotal);

      // Check that salaries are formatted as expected
      expect(result.data[0].salary).toBe('118 M$');
      expect(result.data[1].salary).toBe('31.20 M£');
      expect(result.data[2].salary).toBe('34 M€');
      expect(result.data[3].salary).toBe('35 M$');
      expect(result.data[4].salary).toBe('23 M€');
      expect(result.data[5].salary).toBe('19.73 M€');
    });
  });

  describe('when create is called', () => {
    it('then create should be defined', () => {
      expect(playersService.create).toBeDefined();
    });

    const mockPlayer = playerStub();

    const mockCreatePlayer: CreatePlayerDto = {
      firstname: mockPlayer.firstname,
      lastname: mockPlayer.lastname,
      goal: mockPlayer.goal,
      salary: mockPlayer.salary,
      devise: mockPlayer.devise,
    };

    it('then return the created player', async () => {
      (prismaService.player.create as jest.Mock).mockResolvedValue(mockPlayer);

      const player = await playersService.create(mockCreatePlayer);
      // Assertions

      expect(prismaService.player.create).toHaveBeenCalledTimes(1);
      expect(prismaService.player.create).toHaveBeenCalledWith({
        data: mockCreatePlayer,
      });
      expect(player).toEqual(mockPlayer);
    });

    it('then throw error if player with the same firstname and lastname already exists', async () => {
      (prismaService.player.create as jest.Mock).mockRejectedValue({
        code: 'P2002' 
      })
      // Assertions
      await expect(playersService.create(mockCreatePlayer)).rejects.toThrow(ConflictException);

      expect(prismaService.player.create).toHaveBeenCalledWith({
        data: mockCreatePlayer,
      });
    });
    it('then throw BadRequestException for other errors', async () => {
      (prismaService.player.create as jest.Mock).mockRejectedValue(new Error('something went wrong'));
      // Assertions
      await expect(playersService.create(mockCreatePlayer)).rejects.toThrow(BadRequestException);

      expect(prismaService.player.create).toHaveBeenCalledWith({
        data: mockCreatePlayer,
      });
    });
  });
});


