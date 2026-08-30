import { faker } from '@faker-js/faker';
import { AppDataSource } from '../../data-source';
import { Book } from '../../entities/book.entity';
import {
  BookInventory,
  BookInventoryStatus,
  BookCondition,
} from '../../entities/book-inventory.entity';

const INVENTORY_PER_BOOK = 3;

export async function seedBookInventory(
  books: Book[],
): Promise<BookInventory[]> {
  const existing = await AppDataSource.manager.find(BookInventory);
  const existingBookIds = new Set(existing.map((item) => item.bookId));

  const inventory: BookInventory[] = [];
  for (const book of books) {
    if (existingBookIds.has(book.id)) continue;

    for (let i = 0; i < INVENTORY_PER_BOOK; i++) {
      inventory.push(
        AppDataSource.manager.create(BookInventory, {
          bookId: book.id,
          barcode: faker.string.alphanumeric(12).toUpperCase(),
          status: BookInventoryStatus.AVAILABLE,
          condition: BookCondition.GOOD,
        }),
      );
    }
  }
  const created = inventory.length
    ? await AppDataSource.manager.save(inventory)
    : [];
  return [...existing, ...created];
}
