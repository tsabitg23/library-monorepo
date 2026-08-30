import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { assertEntitiesExist, saveOrThrowConflict } from '../common/utils/typeorm.util';
import { PaginatedResult } from '../common/utils/pagination.util';
import { Book } from '../database/entities/book.entity';
import { Author } from '../database/entities/author.entity';
import { Tag } from '../database/entities/tag.entity';
import { Publisher } from '../database/entities/publisher.entity';
import { BookAuthor } from '../database/entities/book-author.entity';
import { BookTag } from '../database/entities/book-tag.entity';
import {
  BookCondition,
  BookInventory,
  BookInventoryStatus,
} from '../database/entities/book-inventory.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindBooksDto } from './dto/find-books.dto';

const BOOK_RELATIONS = {
  publisher: true,
  bookAuthors: { author: true },
  bookTags: { tag: true },
  inventory: true,
} as const;

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly booksRepository: Repository<Book>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { authorIds, tagIds, stock, ...bookData } = createBookDto;

    return this.dataSource.transaction(async (manager) => {
      const publisher = await manager.findOne(Publisher, {
        where: { id: bookData.publisherId },
      });
      if (!publisher) {
        throw new BadRequestException(
          `Publisher with id ${bookData.publisherId} not found`,
        );
      }
      await assertEntitiesExist(manager, Author, authorIds, 'authors');
      await assertEntitiesExist(manager, Tag, tagIds, 'tags');

      const book = manager.create(Book, bookData);
      const savedBook = await saveOrThrowConflict(
        manager,
        book,
        `Book with isbn ${bookData.isbn} already exists`,
      );

      await manager.save(
        BookAuthor,
        [...new Set(authorIds)].map((authorId) => ({
          bookId: savedBook.id,
          authorId,
        })),
      );

      await manager.save(
        BookTag,
        [...new Set(tagIds)].map((tagId) => ({
          bookId: savedBook.id,
          tagId,
        })),
      );

      await manager.save(
        BookInventory,
        Array.from({ length: stock }, (_, index) => ({
          bookId: savedBook.id,
          barcode: `${savedBook.isbn}${String(index + 1).padStart(4, '0')}`,
          status: BookInventoryStatus.AVAILABLE,
          condition: BookCondition.NEW,
        })),
      );

      return this.findOne(savedBook.id, manager);
    });
  }

  async findAll(query: FindBooksDto = {}): Promise<PaginatedResult<Book>> {
    const { title, isbn, author, tags, page = 1, pageSize = 5 } = query;

    const qb = this.booksRepository
      .createQueryBuilder('book')
      .leftJoin('book.bookAuthors', 'bookAuthors')
      .leftJoin('bookAuthors.author', 'author')
      .leftJoin('book.bookTags', 'bookTags')
      .leftJoin('bookTags.tag', 'tag');

    if (title) {
      qb.andWhere('book.title ILIKE :title', { title: `%${title}%` });
    }

    if (isbn) {
      qb.andWhere('book.isbn ILIKE :isbn', { isbn: `%${isbn}%` });
    }

    if (author) {
      qb.andWhere('author.name ILIKE :author', { author: `%${author}%` });
    }

    if (tags) {
      const tagNames = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
      if (tagNames.length > 0) {
        qb.andWhere('tag.name IN (:...tagNames)', { tagNames });
      }
    }

    // Paginate distinct book ids first, since the joins above multiply rows.
    const [{ ids }, total] = await Promise.all([
      qb
        .clone()
        .select('DISTINCT book.id', 'id')
        .orderBy('book.id')
        .offset((page - 1) * pageSize)
        .limit(pageSize)
        .getRawMany<{ id: string }>()
        .then((rows) => ({ ids: rows.map((row) => row.id) })),
      qb.clone().select('COUNT(DISTINCT book.id)', 'count').getRawOne<{ count: string }>()
        .then((row) => Number(row?.count ?? 0)),
    ]);

    const data = ids.length
      ? await this.booksRepository.find({
          where: { id: In(ids) },
          relations: BOOK_RELATIONS,
        })
      : [];
    data.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));

    return {
      data,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(
    id: string,
    manager: EntityManager = this.dataSource.manager,
  ): Promise<Book> {
    const book = await manager.findOne(Book, {
      where: { id },
      relations: BOOK_RELATIONS,
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const { authorIds, tagIds, ...bookData } = updateBookDto;

    return this.dataSource.transaction(async (manager) => {
      const book = await manager.findOne(Book, { where: { id } });
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`);
      }

      if (bookData.publisherId) {
        const publisher = await manager.findOne(Publisher, {
          where: { id: bookData.publisherId },
        });
        if (!publisher) {
          throw new BadRequestException(
            `Publisher with id ${bookData.publisherId} not found`,
          );
        }
      }

      if (Object.keys(bookData).length > 0) {
        Object.assign(book, bookData);
        await saveOrThrowConflict(
          manager,
          book,
          `Book with isbn ${book.isbn} already exists`,
        );
      }

      if (authorIds) {
        if (authorIds.length === 0) {
          throw new BadRequestException('authorIds cannot be empty');
        }
        await assertEntitiesExist(manager, Author, authorIds, 'authors');
        await manager.delete(BookAuthor, { bookId: id });
        await manager.save(
          BookAuthor,
          [...new Set(authorIds)].map((authorId) => ({ bookId: id, authorId })),
        );
      }

      if (tagIds) {
        if (tagIds.length === 0) {
          throw new BadRequestException('tagIds cannot be empty');
        }
        await assertEntitiesExist(manager, Tag, tagIds, 'tags');
        await manager.delete(BookTag, { bookId: id });
        await manager.save(
          BookTag,
          [...new Set(tagIds)].map((tagId) => ({ bookId: id, tagId })),
        );
      }

      return this.findOne(id, manager);
    });
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.softRemove(book);
  }
}
