import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Author } from './entities/author.entity';
import { Publisher } from './entities/publisher.entity';
import { Tag } from './entities/tag.entity';
import { Book } from './entities/book.entity';
import { BookInventory } from './entities/book-inventory.entity';
import { BookAuthor } from './entities/book-author.entity';
import { BookTag } from './entities/book-tag.entity';
import { User } from './entities/user.entity';
import { BookLoan } from './entities/book-loan.entity';

// Standalone DataSource used by the TypeORM CLI and the seed script (outside the Nest DI context)
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'myapp',
  entities: [
    Author,
    Publisher,
    Tag,
    Book,
    BookInventory,
    BookAuthor,
    BookTag,
    User,
    BookLoan,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
