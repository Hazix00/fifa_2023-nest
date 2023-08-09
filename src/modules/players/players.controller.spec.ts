import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { playersPaginatedStub, playersStub } from './test/stubs/players.stubs';

jest.mock('./players.service');

describe('PlayersController', () => {
  let playersController: PlayersController;
  let playersService: PlayersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [
        {
          provide: PlayersService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    playersController = module.get(PlayersController);
    playersService = module.get(PlayersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(playersController).toBeDefined();
  });

  describe('when findAll is called', () => {
    test('then findAll should be called and return paginated football players', async () => {
      // Use your stub data for the mock implementation
      (playersService.findAll as jest.Mock).mockResolvedValue(playersPaginatedStub());

      const page = 1;
      const limit = 6;
      const result = await playersController.findAll({ page, limit });

      //Assertions
      expect(playersService.findAll).toHaveBeenCalledTimes(1);
      expect(playersService.findAll).toBeCalledWith(page, limit);

      expect(playersController.findAll).toBeDefined();

      expect(result.data.length).toBe(limit);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.total).toBe(playersPaginatedStub().total);

      expect(result.data).toEqual(playersPaginatedStub().data);
    });
  });
});
