import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookLoan } from '../database/entities/book-loan.entity';
import { BookInventory } from '../database/entities/book-inventory.entity';
import { User } from '../database/entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { BorrowsController } from './borrows.controller';
import { BorrowsService } from './borrows.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookLoan, BookInventory, User]),
    AuthModule,
  ],
  controllers: [BorrowsController],
  providers: [BorrowsService],
  exports: [BorrowsService],
})
export class BorrowsModule {}
