import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'CurrentP@ssw0rd' })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'NewStrongP@ssw0rd', minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
