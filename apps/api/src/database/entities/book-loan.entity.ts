import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookInventory, BookCondition } from './book-inventory.entity';
import { User } from './user.entity';

export enum BookLoanStatus {
  ONGOING = 'ongoing',
  RETURNED = 'returned',
  OVERDUE = 'overdue',
}

@Entity('book_loans')
export class BookLoan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'book_inventory_id', type: 'uuid' })
  bookInventoryId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'return_date', type: 'timestamp', nullable: true })
  returnDate: Date | null;

  @Column({ name: 'return_deadline', type: 'timestamp' })
  returnDeadline: Date;

  @Column({ type: 'varchar' })
  status: BookLoanStatus;

  @Column({ name: 'checkout_condition', type: 'varchar' })
  checkoutCondition: BookCondition;

  @Column({ name: 'return_condition', type: 'varchar' })
  returnCondition: BookCondition;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => BookInventory, (bookInventory) => bookInventory.loans)
  @JoinColumn({ name: 'book_inventory_id' })
  bookInventory: BookInventory;

  @ManyToOne(() => User, (user) => user.loans)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
