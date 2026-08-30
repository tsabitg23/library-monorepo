import { faker } from '@faker-js/faker';
import { AppDataSource } from '../../data-source';
import { User, UserStatus } from '../../entities/user.entity';
import { hashPassword } from '../utils/seed.utils';

const USER_COUNT = 10;
const DEFAULT_PASSWORD = 'password123';

const DEFAULT_USERS = [
  {
    email: 'admin@library.com',
    name: 'Admin User',
    phone: faker.phone.number(),
    status: UserStatus.ACTIVE,
  },
  {
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: faker.phone.number(),
    status: UserStatus.ACTIVE,
  },
  {
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    phone: faker.phone.number(),
    status: UserStatus.ACTIVE,
  },
];

export async function seedUsers(): Promise<User[]> {
  const sampleUsers = [
    ...DEFAULT_USERS,
    ...Array.from({ length: Math.max(0, USER_COUNT - DEFAULT_USERS.length) }, () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return {
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        name: `${firstName} ${lastName}`,
        phone: faker.phone.number(),
        status: faker.helpers.arrayElement([
          UserStatus.ACTIVE,
          UserStatus.ACTIVE,
          UserStatus.ACTIVE,
          UserStatus.INACTIVE,
        ]),
      };
    }),
  ];

  const emails = sampleUsers.map((u) => u.email);

  const existing = emails.length
    ? await AppDataSource.manager
        .createQueryBuilder(User, 'user')
        .where('user.email IN (:...emails)', { emails })
        .getMany()
    : [];

  const existingEmails = new Set(existing.map((user) => user.email));

  const toCreate = sampleUsers
    .filter((user) => !existingEmails.has(user.email))
    .map((userData) => {
      const { password, salt } = hashPassword(DEFAULT_PASSWORD);
      return AppDataSource.manager.create(User, {
        email: userData.email,
        password,
        salt,
        name: userData.name,
        phone: userData.phone,
        status: userData.status,
      });
    });

  const created = toCreate.length
    ? await AppDataSource.manager.save(toCreate)
    : [];

  return [...existing, ...created];
}
