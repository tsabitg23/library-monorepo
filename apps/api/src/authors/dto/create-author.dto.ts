import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
