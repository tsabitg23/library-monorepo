import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Publisher } from './publisher.entity';
import { BookAuthor } from './book-author.entity';
import { BookInventory } from './book-inventory.entity';
import { BookTag } from './book-tag.entity';

@Entity('books')
@Index(['title'])
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  isbn: string;

  @Column({ name: 'publisher_id', type: 'uuid' })
  publisherId: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  coverUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  year: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Publisher, (publisher) => publisher.books)
  @JoinColumn({ name: 'publisher_id' })
  publisher: Publisher;

  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.book)
  bookAuthors: BookAuthor[];

  @OneToMany(() => BookTag, (bookTag) => bookTag.book)
  bookTags: BookTag[];

  @OneToMany(() => BookInventory, (bookInventory) => bookInventory.book)
  inventory: BookInventory[];
}
