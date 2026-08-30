import { faker } from '@faker-js/faker';
import { AppDataSource } from '../../data-source';
import { Tag } from '../../entities/tag.entity';

const BOOK_GENRES = [
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Non-fiction',
  'Romance',
  'Thriller',
  'Biography',
  'Historical Fiction',
  'Self improvement',
  'Children',
  'History',
];

export async function seedTags(): Promise<Tag[]> {
  const tags = BOOK_GENRES.map((name) =>
    AppDataSource.manager.create(Tag, {
      name,
      description: faker.lorem.sentence(),
    }),
  );
  return AppDataSource.manager.save(tags);
}
