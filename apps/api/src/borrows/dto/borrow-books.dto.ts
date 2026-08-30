import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsUUID } from 'class-validator';

export class BorrowBooksDto {
  @ApiProperty({
    type: [String],
    example: ['b3f1c2a0-1234-4a5b-8b1a-000000000001'],
  })
  @Transform(({ value }) =>
    Array.isArray(value) ? value : value?.bookIds ?? value?.book_ids ?? [],
  )
  @IsArray()
  @IsUUID('4', { each: true })
  bookIds: string[];
}
