import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../database/entities/book.entity';
import { BookAuthor } from '../database/entities/book-author.entity';
import { BookTag } from '../database/entities/book-tag.entity';
import { BookInventory } from '../database/entities/book-inventory.entity';
import { Author } from '../database/entities/author.entity';
import { Tag } from '../database/entities/tag.entity';
import { Publisher } from '../database/entities/publisher.entity';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      BookAuthor,
      BookTag,
      BookInventory,
      Author,
      Tag,
      Publisher,
    ]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
