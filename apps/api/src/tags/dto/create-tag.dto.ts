import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'Science Fiction' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Books about futuristic science and technology' })
  @IsString()
  @IsNotEmpty()
  description: string;
}
