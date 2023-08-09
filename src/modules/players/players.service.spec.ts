import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { playersStub } from './test/stubs/players.stubs';
import { PrismaService } from '../../common/services/prisma.service';

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
    it('then return paginated football players with formatted salaries', async () => {
      // Use your stub data for the mock implementation
      const mockPlayers = playersStub().slice(0, 6);
      const mockTotal = mockPlayers.length;
      (prismaService.player.findMany as jest.Mock).mockResolvedValue(mockPlayers);
      (prismaService.player.count as jest.Mock).mockResolvedValue(mockTotal);
  
      const page = 1;
      const limit = 6;
  
      const result = await playersService.findAll(page, limit);
  
      // Assertions
      expect(prismaService.player.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.player.findMany).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
      })
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
  })
});
