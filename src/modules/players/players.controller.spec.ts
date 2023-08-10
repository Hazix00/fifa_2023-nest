import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { playerStub, playersPaginatedStub, playersStub, updatePlayerPictureDto } from './test/stubs/players.stubs';
import { CreatePlayerDto } from './dtos';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

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
            findOne: jest.fn(),
            findAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            updatePlayerPicture: jest.fn(),
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

  describe('when updatePlayerPicture is called', () => {

    test('then updatePlayerPicture should be called', async () => {
      expect(playersService.updatePlayerPicture).toBeDefined();
    })
    
    test('then updatePlayerPicture should be called and return "Photo sauvegardée avec succès"', async () => {
      (playersService.updatePlayerPicture as jest.Mock).mockResolvedValue('Photo sauvegardée avec succès');
      
      const updateDto = updatePlayerPictureDto();
      const result = await playersController.updatePlayerPicture(updateDto.playerId, updateDto.file);

      //Assertions
      expect(playersService.updatePlayerPicture).toHaveBeenCalledTimes(1);
      expect(playersService.updatePlayerPicture).toHaveBeenCalledWith(updateDto.playerId, updateDto.file);
      expect(result).toEqual('Photo sauvegardée avec succès');
    })
  })

  describe('when update is called', () => {
    test('then update should be defined', () => {
      expect(playersController.update).toBeDefined();
    });
    test('then update should be called and return the updated player', async () => {
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;
      (playersService.update as jest.Mock).mockResolvedValue('Informations sauvegardée avec succès');
      const message = await playersController.update(1, updatePlayerDtoMock);

      //Assertions
      expect(playersService.update).toHaveBeenCalledTimes(1);
      expect(playersService.update).toHaveBeenCalledWith(1, updatePlayerDtoMock);
      expect(message).toEqual('Informations sauvegardée avec succès');
    });

    test('then throw error if player does not exist', async () => {
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;
      (playersService.update as jest.Mock).mockRejectedValue(new NotFoundException('Player not found'));
      
      await expect(playersController.update(1, updatePlayerDtoMock)).rejects.toThrowError(NotFoundException);

      //Assertions
      expect(playersService.update).toHaveBeenCalledTimes(1);
      expect(playersService.update).toHaveBeenCalledWith(1, updatePlayerDtoMock);
    })

    test('then throw error if player with the same firstname and lastname already exists with different id', async () => {
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;

      (playersService.update as jest.Mock).mockRejectedValue(new ConflictException('Player already exists'));

      await expect(playersController.update(1, updatePlayerDtoMock)).rejects.toThrowError(ConflictException);

      //Assertions
      expect(playersService.update).toHaveBeenCalledTimes(1);
      expect(playersService.update).toHaveBeenCalledWith(1, updatePlayerDtoMock);
    })

    test('then throw BadRequestException for other errors', async () => {
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;

      (playersService.update as jest.Mock).mockRejectedValue(new BadRequestException('Error while updating player'));

      await expect(playersController.update(1, updatePlayerDtoMock)).rejects.toThrowError(BadRequestException);

      //Assertions
      expect(playersService.update).toHaveBeenCalledTimes(1);
      expect(playersService.update).toHaveBeenCalledWith(1, updatePlayerDtoMock);
    })
  });
});
