import 'dotenv/config';
import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { seedAuthors } from './seeders/01-authors.seeder';
import { seedPublishers } from './seeders/02-publishers.seeder';
import { seedTags } from './seeders/03-tags.seeder';
import { seedBooks } from './seeders/05-books.seeder';
import { seedBookAuthors } from './seeders/06-book-authors.seeder';
import { seedBookTags } from './seeders/07-book-tags.seeder';
import { seedBookInventory } from './seeders/08-book-inventory.seeder';

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const [authorsByName, publishers, tags] = await Promise.all([
      seedAuthors(),
      seedPublishers(),
      seedTags(),
    ]);

    const books = await seedBooks(publishers);
    await Promise.all([
      seedBookAuthors(books, authorsByName),
      seedBookTags(books, tags),
    ]);

    await seedBookInventory(books);
    

    console.log('Seeding completed successfully.');
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
