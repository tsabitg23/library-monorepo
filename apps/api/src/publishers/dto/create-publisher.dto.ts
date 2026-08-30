import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePublisherDto {
  @ApiProperty({ example: 'Penguin Books' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
