import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { BookLoan } from './book-loan.entity';

export enum BookInventoryStatus {
  AVAILABLE = 'available',
  BORROWED = 'borrowed',
  LOST = 'lost',
  DAMAGED = 'damaged',
}

export enum BookCondition {
  NEW = 'new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  LOST = 'lost',
}

@Entity('book_inventory')
export class BookInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'book_id', type: 'uuid' })
  bookId: string;

  @Column({ type: 'varchar', unique: true })
  barcode: string;

  @Column({ type: 'varchar' })
  status: BookInventoryStatus;

  @Column({ type: 'varchar' })
  condition: BookCondition;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Book, (book) => book.inventory)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.bookInventory)
  loans: BookLoan[];
}
