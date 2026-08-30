import { AppDataSource } from '../../data-source';
import { Author } from '../../entities/author.entity';
import { booksData } from '../data/books-source';

// Keyed by name so book-authors seeding can look authors up by the json "author" field
export async function seedAuthors(): Promise<Map<string, Author>> {
  const uniqueNames = Array.from(new Set(booksData.map((book) => book.author)));

  const existingByName = new Map(
    (uniqueNames.length
      ? await AppDataSource.manager
          .createQueryBuilder(Author, 'author')
          .where('author.name IN (:...names)', { names: uniqueNames })
          .getMany()
      : []
    ).map((author) => [author.name, author]),
  );

  const toCreate = uniqueNames
    .filter((name) => !existingByName.has(name))
    .map((name) => AppDataSource.manager.create(Author, { name }));
  const created = toCreate.length
    ? await AppDataSource.manager.save(toCreate)
    : [];

  const authorsByName = new Map(existingByName);
  for (const author of created) {
    authorsByName.set(author.name, author);
  }
  return authorsByName;
}
