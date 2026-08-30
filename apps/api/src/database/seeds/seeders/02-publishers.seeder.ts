import { faker } from '@faker-js/faker';
import { AppDataSource } from '../../data-source';
import { Publisher } from '../../entities/publisher.entity';

const PUBLISHER_COUNT = 10;

export async function seedPublishers(): Promise<Publisher[]> {
  const publishers = Array.from({ length: PUBLISHER_COUNT }, () =>
    AppDataSource.manager.create(Publisher, { name: faker.company.name() }),
  );
  return AppDataSource.manager.save(publishers);
}
