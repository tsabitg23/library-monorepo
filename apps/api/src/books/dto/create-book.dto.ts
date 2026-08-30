import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: '9781234567897' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiProperty({ example: 'b3f1c2a0-1234-4a5b-8b1a-000000000000' })
  @IsUUID()
  publisherId: string;

  @ApiProperty({ example: 'The Fellowship of the Ring' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'https://example.com/covers/fotr.jpg' })
  @IsString()
  @IsNotEmpty()
  coverUrl: string;

  @ApiProperty({ example: 'The first volume of The Lord of the Rings.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 1954 })
  @IsInt()
  @Min(0)
  year: number;

  @ApiProperty({
    example: ['b3f1c2a0-1234-4a5b-8b1a-000000000001'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  authorIds: string[];

  @ApiProperty({
    example: ['b3f1c2a0-1234-4a5b-8b1a-000000000002'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  tagIds: string[];

  @ApiProperty({
    example: 10,
    description: 'Number of physical copies to add to inventory',
  })
  @IsInt()
  @Min(1)
  stock: number;
}
