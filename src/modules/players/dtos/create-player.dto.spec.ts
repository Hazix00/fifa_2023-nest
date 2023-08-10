import { playerStub } from '../test/stubs/players.stubs';
import { CreatePlayerDto } from './create-player.dto';
import { validate } from 'class-validator';

describe('CreatePlayerDto', () => {
  it('should validate a valid CreatePlayerDto', async () => {
    const validDto = new CreatePlayerDto();
    Object.entries(playerStub()).forEach(([key, value]) => {
      validDto[key] = value;
    });
    const errors = await validate(validDto);

    expect(errors.length).toBe(0);
  });

  it('should not validate if firstname is empty', async () => {
    const dto = new CreatePlayerDto();
    Object.entries(playerStub()).forEach(([key, value]) => {
      dto[key] = value;
    });
    delete dto.firstname;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate if lastname is empty', async () => {
    const dto = new CreatePlayerDto();
    Object.entries(playerStub()).forEach(([key, value]) => {
      dto[key] = value;
    });
    delete dto.lastname;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not complain if goal is empty', async () => {
    const dto = new CreatePlayerDto();
    Object.entries(playerStub()).forEach(([key, value]) => {
      dto[key] = value;
    });
    delete dto.goal;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should not validate if salary is empty when devise is provided', async () => {
    const dto = new CreatePlayerDto();
    Object.entries(playerStub()).forEach(([key, value]) => {
      dto[key] = value;
    });
    delete dto.salary;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should not validate if devise is empty when salary is provided', async () => {
    const dto = new CreatePlayerDto();
    Object.entries(playerStub()).forEach(([key, value]) => {
      dto[key] = value;
    });
    delete dto.devise;

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
