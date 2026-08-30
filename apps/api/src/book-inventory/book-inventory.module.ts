import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookInventory } from '../database/entities/book-inventory.entity';
import { Book } from '../database/entities/book.entity';
import { BookInventoryController } from './book-inventory.controller';
import { BookInventoryService } from './book-inventory.service';

@Module({
  imports: [TypeOrmModule.forFeature([BookInventory, Book])],
  controllers: [BookInventoryController],
  providers: [BookInventoryService],
  exports: [BookInventoryService],
})
export class BookInventoryModule {}
