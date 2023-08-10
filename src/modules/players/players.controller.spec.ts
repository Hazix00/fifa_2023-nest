import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { playerStub, playersPaginatedStub, playersStub } from './test/stubs/players.stubs';
import { CreatePlayerDto } from './dtos';
import { BadRequestException, ConflictException } from '@nestjs/common';

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
            create: jest.fn(),
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

  describe('when create is called', () => {
    const mockPlayer = playerStub();

    const mockCreatePlayer: CreatePlayerDto = {
      firstname: mockPlayer.firstname,
      lastname: mockPlayer.lastname,
      goal: mockPlayer.goal,
      salary: mockPlayer.salary,
      devise: mockPlayer.devise,
    };
    test('then create should be called and return the created player', async () => {
      // Use your stub data for the mock implementation
      (playersService.create as jest.Mock).mockResolvedValue(playersStub());

      const player = await playersController.create(mockCreatePlayer);

      //Assertions
      expect(playersService.create).toHaveBeenCalledTimes(1);
      expect(playersService.create).toBeCalledWith(mockCreatePlayer);

      expect(player).toEqual(playersStub());
    });

    test('then throw error if player with the same firstname and lastname already exists', async () => {
      (playersService.create as jest.Mock).mockRejectedValue(
        new ConflictException('Player already exists'),
      );

      //Assertions
      await expect(playersController.create(mockCreatePlayer)).rejects.toThrowError(
        ConflictException
      );

      expect(playersService.create).toHaveBeenCalledTimes(1);
      expect(playersService.create).toBeCalledWith(mockCreatePlayer);

    })

    test('then throw BadRequestException for other errors', async () => {
      (playersService.create as jest.Mock).mockRejectedValue(
        new BadRequestException(),
      );

      //Assertions
      await expect(playersController.create(mockCreatePlayer)).rejects.toThrowError(
        BadRequestException
      );

      expect(playersService.create).toHaveBeenCalledTimes(1);
      expect(playersService.create).toBeCalledWith(mockCreatePlayer);

    }) 
  })
});
