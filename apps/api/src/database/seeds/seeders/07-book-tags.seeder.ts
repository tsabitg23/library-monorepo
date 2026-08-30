import { faker } from '@faker-js/faker';
import { AppDataSource } from '../../data-source';
import { Book } from '../../entities/book.entity';
import { Tag } from '../../entities/tag.entity';
import { BookTag } from '../../entities/book-tag.entity';
import { pickRandomUnique } from '../utils/seed.utils';

export async function seedBookTags(books: Book[], tags: Tag[]): Promise<void> {
  const existingBookIds = new Set(
    (await AppDataSource.manager.find(BookTag)).map((bookTag) => bookTag.bookId),
  );

  const bookTags: BookTag[] = [];
  for (const book of books) {
    if (existingBookIds.has(book.id)) continue;

    const assignedTags = pickRandomUnique(
      tags,
      faker.number.int({ min: 1, max: 4 }),
    );
    for (const tag of assignedTags) {
      bookTags.push(
        AppDataSource.manager.create(BookTag, {
          bookId: book.id,
          tagId: tag.id,
        }),
      );
    }
  }
  if (bookTags.length) {
    await AppDataSource.manager.save(bookTags);
  }
}
