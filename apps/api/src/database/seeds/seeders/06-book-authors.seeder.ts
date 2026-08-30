import { AppDataSource } from '../../data-source';
import { Author } from '../../entities/author.entity';
import { Book } from '../../entities/book.entity';
import { BookAuthor } from '../../entities/book-author.entity';
import { booksData } from '../data/books-source';

export async function seedBookAuthors(
  books: Book[],
  authorsByName: Map<string, Author>,
): Promise<void> {
  const booksByTitle = new Map(books.map((book) => [book.title, book]));
  const existingPairs = new Set(
    (await AppDataSource.manager.find(BookAuthor)).map(
      (bookAuthor) => `${bookAuthor.bookId}:${bookAuthor.authorId}`,
    ),
  );

  const bookAuthors: BookAuthor[] = [];
  for (const data of booksData) {
    const book = booksByTitle.get(data.title);
    const author = authorsByName.get(data.author);
    if (!book || !author) continue;

    const key = `${book.id}:${author.id}`;
    if (existingPairs.has(key)) continue;

    bookAuthors.push(
      AppDataSource.manager.create(BookAuthor, {
        bookId: book.id,
        authorId: author.id,
      }),
    );
  }

  if (bookAuthors.length) {
    await AppDataSource.manager.save(bookAuthors);
  }
}
