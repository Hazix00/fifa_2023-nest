import { playersStub } from "../test/stubs/players.stubs";

export const PlayersService = jest.fn().mockReturnValue({
    findAll: jest.fn().mockResolvedValue({
        data: playersStub().slice(0, 6),
        total: playersStub().length,
        page: 1,
        limit: 6
    }),
})