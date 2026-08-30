import { faker } from '@faker-js/faker';
import { AppDataSource } from '../../data-source';
import { Book } from '../../entities/book.entity';
import { Publisher } from '../../entities/publisher.entity';
import { booksData } from '../data/books-source';
import { pickRandom } from '../utils/seed.utils';

export async function seedBooks(publishers: Publisher[]): Promise<Book[]> {
  const titles = booksData.map((book) => book.title);
  const existing = titles.length
    ? await AppDataSource.manager
        .createQueryBuilder(Book, 'book')
        .where('book.title IN (:...titles)', { titles })
        .getMany()
    : [];
  const existingTitles = new Set(existing.map((book) => book.title));

  const toCreate = booksData
    .filter((data) => !existingTitles.has(data.title))
    .map((data) =>
      AppDataSource.manager.create(Book, {
        isbn: faker.commerce.isbn(),
        publisherId: pickRandom(publishers).id,
        title: data.title,
        coverUrl: data.imageLink,
        description: faker.lorem.paragraph(),
        year: data.year,
      }),
    );
  const created = toCreate.length
    ? await AppDataSource.manager.save(toCreate)
    : [];

  return [...existing, ...created];
}
