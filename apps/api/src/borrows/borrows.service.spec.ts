import { BadRequestException } from '@nestjs/common';
import { BorrowsService } from './borrows.service';

describe('BorrowsService', () => {
  it('rejects a borrow when the user already reached the active loan limit', async () => {
    const bookLoanRepository = {
      count: jest.fn().mockResolvedValue(2),
    };
    const bookInventoryRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const usersRepository = {
      findOne: jest.fn().mockResolvedValue({
        id: 'user-1',
        status: 'active',
      }),
    };
    const dataSource = {
      transaction: jest.fn(async (callback) => callback({
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
      })),
    };

    const service = new BorrowsService(
      bookLoanRepository as any,
      bookInventoryRepository as any,
      usersRepository as any,
      dataSource as any,
    );

    await expect(service.borrowBooks('user-1', ['book-1'])).rejects.toThrow(
      BadRequestException,
    );
  });
});
