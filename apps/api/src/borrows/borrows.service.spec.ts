import { BadRequestException } from '@nestjs/common';
import { BookCondition } from '../database/entities/book-inventory.entity';
import { BookLoanStatus } from '../database/entities/book-loan.entity';
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

  it('infers the return status from the deadline when a book is returned', async () => {
    const bookLoanRepository = {
      find: jest.fn(),
      count: jest.fn(),
    };
    const bookInventoryRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    const usersRepository = {
      findOne: jest.fn(),
    };
    const dataSource = {
      transaction: jest.fn(async (callback) =>
        callback({
          find: jest.fn().mockResolvedValue([
            {
              id: 'loan-1',
              userId: 'user-1',
              bookInventoryId: 'inventory-1',
              bookInventory: { bookId: 'book-1' },
              returnDeadline: new Date(Date.now() - 60_000),
              status: BookLoanStatus.ONGOING,
              returnCondition: BookCondition.GOOD,
              notes: null,
            },
          ]),
          findOne: jest.fn().mockResolvedValue({
            id: 'inventory-1',
            status: 'borrowed',
            condition: BookCondition.GOOD,
          }),
          save: jest.fn(async (_, entity) => entity),
        }),
      ),
    };

    const service = new BorrowsService(
      bookLoanRepository as any,
      bookInventoryRepository as any,
      usersRepository as any,
      dataSource as any,
    );

    const [result] = await service.returnBooks('user-1', [
      { bookId: 'book-1', returnCondition: BookCondition.GOOD },
    ]);

    expect(result.status).toBe(BookLoanStatus.OVERDUE);
  });
});
