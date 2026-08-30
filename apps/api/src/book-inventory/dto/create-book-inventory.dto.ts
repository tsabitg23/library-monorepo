import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { BookCondition } from '../../database/entities/book-inventory.entity';

export class CreateBookInventoryDto {
  @ApiProperty({ example: 'b3f1c2a0-1234-4a5b-8b1a-000000000000' })
  @IsUUID()
  bookId: string;

  @ApiProperty({ example: '9781234567897-0001' })
  @IsString()
  @IsNotEmpty()
  barcode: string;

  @ApiPropertyOptional({ enum: BookCondition, example: BookCondition.NEW })
  @IsOptional()
  @IsEnum(BookCondition)
  condition?: BookCondition;
}
