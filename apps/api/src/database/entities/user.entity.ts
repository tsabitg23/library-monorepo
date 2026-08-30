import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BookLoan } from './book-loan.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @ApiHideProperty()
  @Column({ type: 'varchar' })
  password: string;

  @ApiHideProperty()
  @Column({ type: 'varchar' })
  salt: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @ApiProperty({ enum: UserStatus })
  @Column({ type: 'varchar', default: UserStatus.ACTIVE })
  status: UserStatus;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.user)
  loans: BookLoan[];
}
