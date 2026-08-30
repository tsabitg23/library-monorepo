import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Book } from './book.entity';
import { Tag } from './tag.entity';

@Entity('book_tags')
@Unique(['bookId', 'tagId'])
export class BookTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'book_id', type: 'uuid' })
  bookId: string;

  @Column({ name: 'tag_id', type: 'uuid' })
  tagId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => Book, (book) => book.bookTags)
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @ManyToOne(() => Tag, (tag) => tag.bookTags)
  @JoinColumn({ name: 'tag_id' })
  tag: Tag;
}
