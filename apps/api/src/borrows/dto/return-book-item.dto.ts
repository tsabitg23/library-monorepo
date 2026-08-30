import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { BookCondition } from '../../database/entities/book-inventory.entity';

export class ReturnBookItemDto {
  @ApiProperty({ example: 'b3f1c2a0-1234-4a5b-8b1a-000000000001' })
  @Transform(({ value, obj }) => value ?? obj.book_id ?? obj.bookId)
  @IsUUID('4')
  bookId: string;

  @ApiProperty({ enum: BookCondition, example: BookCondition.GOOD })
  @Transform(({ value, obj }) =>
    value ?? obj.return_condition ?? obj.returnCondition,
  )
  @IsEnum(BookCondition)
  returnCondition: BookCondition;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
    example: 'Cover had minor scratches but was returned on time.',
  })
  @Transform(({ value, obj }) => value ?? obj.notes ?? null)
  @IsOptional()
  @IsString()
  notes?: string | null;
}
