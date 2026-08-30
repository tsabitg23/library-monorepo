import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class FindBooksDto {
  @ApiPropertyOptional({ example: 'Fellowship' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: '9781234567897' })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({ example: 'J.R.R. Tolkien' })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    example: 'fantasy',
    description: 'Comma-separated list of tag names',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 5, default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 5;
}
