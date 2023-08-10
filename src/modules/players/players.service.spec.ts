import { Test, TestingModule } from '@nestjs/testing';
import { PlayersService } from './players.service';
import { playerStub, playersStub, updatePlayerPictureDto } from './test/stubs/players.stubs';
import { PrismaService } from '../../common/services/prisma.service';
import { CreatePlayerDto } from './dtos/create-player.dto';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { FirebaseStorageService } from '../firebase-storage/firebase-storage.service';

describe('PlayersService', () => {
  let playersService: PlayersService;
  let prismaService: PrismaService;
  let firebaseStorageService: FirebaseStorageService;

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
              update: jest.fn(),
            },
          },
        },
        {
          provide: FirebaseStorageService,
          useValue: {
            uploadFile: jest.fn().mockResolvedValue('download-url'), // Mock the public URL
          },
        },
      ],
    }).compile();

    playersService = module.get(PlayersService);
    prismaService = module.get(PrismaService);
    firebaseStorageService = module.get(FirebaseStorageService);
    jest.clearAllMocks();
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

  describe('when findOne is called', () => {
    it('then findOne should be defined', () => {
      expect(playersService.findOne).toBeDefined();
    });

    it('then return the player', async () => {
      const mockPlayer = playerStub();
      (prismaService.player.findUnique as jest.Mock).mockResolvedValue(mockPlayer);

      const player = await playersService.findOne(1);
      // Assertions
      expect(prismaService.player.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.player.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
      expect(player).toEqual(mockPlayer);
    })

    it('then throw error if player does not exist', async () => {
      (prismaService.player.findUnique as jest.Mock).mockResolvedValue(null);
      // Assertions
      await expect(playersService.findOne(1)).rejects.toThrow(NotFoundException);

      expect(prismaService.player.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.player.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })
  })

  describe('when updatePlayerPicture is called', () => {
    it('then updatePlayerPicture should be defined', () => {
      expect(playersService.updatePlayerPicture).toBeDefined();
    });

    it('then update player picture URL and return updated player', async () => {
      const mockPlayer = playerStub();
      const updateDto = updatePlayerPictureDto();
      const updatedPlayerMock = { ...mockPlayer, pictureUrl: 'download-url' };

      (prismaService.player.findUnique as jest.Mock).mockResolvedValue(mockPlayer);
      (prismaService.player.update as jest.Mock).mockResolvedValue(updatedPlayerMock);
      jest.spyOn(playersService, 'findOne').mockResolvedValue(mockPlayer);

      const messge = await playersService.updatePlayerPicture(updateDto.playerId, updateDto.file);

      // Assertions
      expect(playersService.findOne).toHaveBeenCalledTimes(1);
      expect(playersService.findOne).toHaveBeenCalledWith(updateDto.playerId);

      expect(firebaseStorageService.uploadFile).toHaveBeenCalledTimes(1);
      expect(firebaseStorageService.uploadFile).toHaveBeenCalledWith(
        updateDto.file
      );

      expect(prismaService.player.update).toHaveBeenCalledTimes(1);
      expect(prismaService.player.update).toHaveBeenCalledWith({
        where: { id: updateDto.playerId },
        data: { pictureURl: 'download-url' },
      })

      expect(messge).toEqual('Photo sauvegardée avec succès');
    });
  });

  describe('when update is called', () => {
    it('then update should be defined', () => {
      expect(playersService.update).toBeDefined();
    })

    it('then return the updated player', async () => {
      const mockPlayer = playerStub();
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;

      jest.spyOn(playersService, 'findOne').mockResolvedValue(mockPlayer);
      (prismaService.player.update as jest.Mock).mockResolvedValue(mockPlayer);

      const message = await playersService.update(1, updatePlayerDtoMock);

      // Assertions
      expect(playersService.findOne).toHaveBeenCalledTimes(1);
      expect(playersService.findOne).toHaveBeenCalledWith(1);

      expect(prismaService.player.update).toHaveBeenCalledTimes(1);
      expect(prismaService.player.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePlayerDtoMock,
      })

      expect(message).toEqual('Informations sauvegardée avec succès');
    })

    it('then throw error if player does not exist', async () => {
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;

      jest.spyOn(playersService, 'findOne').mockRejectedValue(new NotFoundException());

      // Assertions
      await expect(playersService.update(1, playerStub())).rejects.toThrow(NotFoundException);

      expect(playersService.findOne).toHaveBeenCalledTimes(1);
      expect(playersService.findOne).toHaveBeenCalledWith(1);
    })

    it('then throw error if player with the same firstname and lastname already exists with different id', async () => {
      const mockPlayer = playerStub();
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;

      jest.spyOn(playersService, 'findOne').mockResolvedValue(mockPlayer);
      (prismaService.player.update as jest.Mock).mockRejectedValue({
        code: 'P2002'
      })

      // Assertions
      await expect(playersService.update(1, updatePlayerDtoMock)).rejects.toThrow(ConflictException);

      expect(playersService.findOne).toHaveBeenCalledTimes(1);
      expect(playersService.findOne).toHaveBeenCalledWith(1);

      expect(prismaService.player.update).toHaveBeenCalledTimes(1);
      expect(prismaService.player.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePlayerDtoMock,
      })
    })

    it('then throw BadRequestException for other errors', async () => {
      const mockPlayer = playerStub();
      const updatePlayerDtoMock = playerStub();
      delete updatePlayerDtoMock.id;

      jest.spyOn(playersService, 'findOne').mockResolvedValue(mockPlayer);
      (prismaService.player.update as jest.Mock).mockRejectedValue(new Error('something went wrong'));

      // Assertions
      await expect(playersService.update(1, updatePlayerDtoMock)).rejects.toThrow(BadRequestException);

      expect(playersService.findOne).toHaveBeenCalledTimes(1);
      expect(playersService.findOne).toHaveBeenCalledWith(1);

      expect(prismaService.player.update).toHaveBeenCalledTimes(1);
      expect(prismaService.player.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePlayerDtoMock,
      })
    })
  });
});


