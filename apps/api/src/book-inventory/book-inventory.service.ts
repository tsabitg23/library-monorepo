import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { saveOrThrowConflict } from '../common/utils/typeorm.util';
import { Book } from '../database/entities/book.entity';
import {
  BookCondition,
  BookInventory,
  BookInventoryStatus,
} from '../database/entities/book-inventory.entity';
import { CreateBookInventoryDto } from './dto/create-book-inventory.dto';
import { UpdateBookInventoryConditionDto } from './dto/update-book-inventory-condition.dto';

@Injectable()
export class BookInventoryService {
  constructor(
    @InjectRepository(BookInventory)
    private readonly bookInventoryRepository: Repository<BookInventory>,
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
  ) {}

  async create(
    createBookInventoryDto: CreateBookInventoryDto,
  ): Promise<BookInventory> {
    const { bookId, condition, ...rest } = createBookInventoryDto;

    const book = await this.booksRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new BadRequestException(`Book with id ${bookId} not found`);
    }

    const inventory = this.bookInventoryRepository.create({
      ...rest,
      bookId,
      condition: condition ?? BookCondition.NEW,
      status: BookInventoryStatus.AVAILABLE,
    });

    return saveOrThrowConflict(
      this.bookInventoryRepository.manager,
      inventory,
      `Book inventory with barcode ${inventory.barcode} already exists`,
    );
  }

  findAll(): Promise<BookInventory[]> {
    return this.bookInventoryRepository.find({ relations: { book: true } });
  }

  async findOne(id: string): Promise<BookInventory> {
    const inventory = await this.bookInventoryRepository.findOne({
      where: { id },
      relations: { book: true },
    });
    if (!inventory) {
      throw new NotFoundException(`Book inventory with id ${id} not found`);
    }
    return inventory;
  }

  async updateCondition(
    id: string,
    updateBookInventoryConditionDto: UpdateBookInventoryConditionDto,
  ): Promise<BookInventory> {
    const inventory = await this.findOne(id);
    inventory.condition = updateBookInventoryConditionDto.condition;
    return this.bookInventoryRepository.save(inventory);
  }

  async remove(id: string): Promise<void> {
    const inventory = await this.findOne(id);
    if (inventory.status === BookInventoryStatus.BORROWED) {
      throw new ConflictException(
        'Book inventory cannot be deleted while it is borrowed',
      );
    }
    await this.bookInventoryRepository.softRemove(inventory);
  }
}
