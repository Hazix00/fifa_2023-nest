import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import exp from 'constants';
import { playersStub } from './test/stubs/players.stubs';

jest.mock('./players.service');

describe('PlayersController', () => {
  let playersController: PlayersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [PlayersService],
    }).compile();

    playersController = module.get(PlayersController);
  });

  it('should be defined', () => {
    expect(playersController).toBeDefined();
  });

  describe('when findAll is called', async () => {
    const page = 1;
    const limit = 6;
    const result = await playersController.findAll(page, limit);
    test('then findAll should be called', () => {
      expect(playersController.findAll).toBeDefined();
      expect(playersController.findAll).toBeCalledTimes(1);
      expect(playersController.findAll).toBeCalledWith(page, limit);
    });

    test('then findAll should return paginated football players', () => {
      expect(result.data.length).toBe(limit);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.total).toBe(playersStub().length);

      expect(result.data).toEqual(playersStub().slice(0, limit));
    })
  });
});
