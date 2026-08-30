import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, LessThan, Repository } from 'typeorm';
import { User, UserStatus } from '../database/entities/user.entity';
import {
  BookCondition,
  BookInventory,
  BookInventoryStatus,
} from '../database/entities/book-inventory.entity';
import {
  BookLoan,
  BookLoanStatus,
} from '../database/entities/book-loan.entity';
import { ReturnBookItemDto } from './dto/return-book-item.dto';

@Injectable()
export class BorrowsService {
  private readonly maxActiveLoans = Number(
    process.env.MAXIMUM_ACTIVE_LOANS ?? 5,
  );
  private readonly defaultLoanDurationDays = Number(
    process.env.DEFAULT_LOAN_DURATION_DAYS ?? 30,
  );
  private readonly lostBookThreshold = Number(
    process.env.LOST_BOOK_THRESHOLD ?? 3,
  );
  private readonly damageBookThreshold = Number(
    process.env.DAMAGE_BOOK_THRESHOLD ?? 10,
  );

  constructor(
    @InjectRepository(BookLoan)
    private readonly bookLoanRepository: Repository<BookLoan>,
    @InjectRepository(BookInventory)
    private readonly bookInventoryRepository: Repository<BookInventory>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async borrowBooks(userId: string, bookIds: string[]): Promise<BookLoan[]> {
    const normalizedBookIds = (bookIds ?? []).map((bookId) => String(bookId));
    const uniqueBookIds = [...new Set(normalizedBookIds)];
    if (!uniqueBookIds.length) {
      throw new BadRequestException('At least one bookId is required');
    }
    if (uniqueBookIds.length !== normalizedBookIds.length) {
      throw new BadRequestException('Duplicate bookIds are not allowed');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User is not active and cannot borrow books');
    }

    const previousLoans = await this.bookLoanRepository.find({
      where: { userId },
      relations: { bookInventory: true },
    });
    this.assertPreviousBorrowHistoryAllowsNewLoan(previousLoans);

    const overdueLoanCount = await this.bookLoanRepository.count({
      where: {
        userId,
        status: BookLoanStatus.ONGOING,
        returnDeadline: LessThan(new Date()),
      },
    });
    if (overdueLoanCount > 0) {
      throw new BadRequestException(
        'User has overdue books and must return them before borrowing more',
      );
    }

    const activeLoanCount = await this.bookLoanRepository.count({
      where: {
        userId,
        status: In([BookLoanStatus.ONGOING, BookLoanStatus.OVERDUE]),
      } as any,
    });
    this.assertBorrowCapacityAllowsNewLoan(activeLoanCount, uniqueBookIds.length);

    return this.dataSource.transaction(async (manager) => {
      const activeLoanCountInTransaction = await manager.count(BookLoan, {
        where: {
          userId,
          status: In([BookLoanStatus.ONGOING, BookLoanStatus.OVERDUE]),
        } as any,
      });
      this.assertBorrowCapacityAllowsNewLoan(
        activeLoanCountInTransaction,
        uniqueBookIds.length,
      );

      const createdLoans: BookLoan[] = [];
      for (const bookId of uniqueBookIds) {
        const availableInventory = await manager.findOne(BookInventory, {
          where: {
            bookId,
            status: BookInventoryStatus.AVAILABLE,
          },
          order: { createdAt: 'ASC' },
        });

        if (!availableInventory) {
          throw new BadRequestException(
            `Book with id ${bookId} is not available for borrowing`,
          );
        }

        const newLoan = manager.create(BookLoan, {
          bookInventoryId: availableInventory.id,
          userId,
          returnDate: null,
          returnDeadline: this.getReturnDeadline(),
          status: BookLoanStatus.ONGOING,
          checkoutCondition: availableInventory.condition,
          returnCondition: availableInventory.condition,
        });

        const savedLoan = await manager.save(BookLoan, newLoan);
        availableInventory.status = BookInventoryStatus.BORROWED;
        await manager.save(BookInventory, availableInventory);
        createdLoans.push(savedLoan);
      }

      return createdLoans;
    });
  }

  async returnBooks(
    userId: string,
    returnItems: ReturnBookItemDto[],
  ): Promise<BookLoan[]> {
    if (!returnItems.length) {
      throw new BadRequestException('At least one item is required to return');
    }

    const uniqueItems = Array.from(
      new Map(returnItems.map((item) => [item.bookId, item])).values(),
    );

    return this.dataSource.transaction(async (manager) => {
      const ongoingLoans = await manager.find(BookLoan, {
        where: {
          userId,
          status: BookLoanStatus.ONGOING,
        },
        relations: { bookInventory: { book: true } },
      });

      const returnedLoans: BookLoan[] = [];
      for (const item of uniqueItems) {
        const loan = ongoingLoans.find(
          (ongoingLoan) => ongoingLoan.bookInventory?.bookId === item.bookId,
        );

        if (!loan) {
          throw new NotFoundException(
            `No active loan was found for book ${item.bookId} for this user`,
          );
        }

        loan.returnCondition = item.returnCondition;
        loan.returnDate = new Date();
        loan.status = BookLoanStatus.RETURNED;

        const inventory = await manager.findOne(BookInventory, {
          where: { id: loan.bookInventoryId },
        });
        if (!inventory) {
          throw new NotFoundException(
            `Book inventory for loan ${loan.id} was not found`,
          );
        }

        inventory.condition = item.returnCondition;
        inventory.status = this.getInventoryStatusForReturnedBook(
          item.returnCondition,
        );

        await manager.save(BookInventory, inventory);
        returnedLoans.push(await manager.save(BookLoan, loan));
      }

      return returnedLoans;
    });
  }

  async findBorrowHistory(
    userId: string,
    search?: string,
  ): Promise<BookLoan[]> {
    const loans = await this.bookLoanRepository.find({
      where: { userId },
      relations: { bookInventory: { book: true } },
      order: { createdAt: 'DESC' },
    });

    const normalizedSearch = (search ?? '').trim().toLowerCase();
    if (!normalizedSearch) {
      return loans;
    }

    return loans.filter((loan) =>
      loan.bookInventory?.book?.title
        ?.toLowerCase()
        .includes(normalizedSearch),
    );
  }

  private assertBorrowCapacityAllowsNewLoan(
    activeLoanCount: number,
    requestedBookCount: number,
  ): void {
    const remainingCapacity = this.maxActiveLoans - activeLoanCount;

    if (requestedBookCount > remainingCapacity) {
      throw new BadRequestException(
        `User can borrow at most ${remainingCapacity} more book(s) before reaching the maximum of ${this.maxActiveLoans} active loans`,
      );
    }
  }

  private assertPreviousBorrowHistoryAllowsNewLoan(
    previousLoans: BookLoan[],
  ): void {
    const { lostCount, damageCount } = this.getPreviousBorrowRiskCounts(
      previousLoans,
    );

    if (lostCount >= this.lostBookThreshold) {
      throw new BadRequestException(
        `User has reached the lost-book threshold (${this.lostBookThreshold})`,
      );
    }

    if (damageCount >= this.damageBookThreshold) {
      throw new BadRequestException(
        `User has reached the damaged-book threshold (${this.damageBookThreshold})`,
      );
    }
  }

  private getPreviousBorrowRiskCounts(previousLoans: BookLoan[]): {
    lostCount: number;
    damageCount: number;
  } {
    const lostCount = previousLoans.filter(
      (loan) => loan.returnCondition === BookCondition.LOST,
    ).length;

    const damageCount = previousLoans.filter(
      (loan) =>
        loan.returnCondition === BookCondition.POOR &&
        loan.checkoutCondition !== BookCondition.POOR &&
        loan.checkoutCondition !== BookCondition.LOST,
    ).length;

    return { lostCount, damageCount };
  }

  private getInventoryStatusForReturnedBook(
    returnCondition: BookCondition,
  ): BookInventoryStatus {
    if (returnCondition === BookCondition.LOST) {
      return BookInventoryStatus.LOST;
    }

    if (returnCondition === BookCondition.POOR) {
      return BookInventoryStatus.DAMAGED;
    }

    return BookInventoryStatus.AVAILABLE;
  }

  private getReturnDeadline(): Date {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + this.defaultLoanDurationDays);
    return deadline;
  }
}
