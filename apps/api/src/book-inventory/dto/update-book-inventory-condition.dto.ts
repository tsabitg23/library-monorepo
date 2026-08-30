import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { BookCondition } from '../../database/entities/book-inventory.entity';

export class UpdateBookInventoryConditionDto {
  @ApiProperty({ enum: BookCondition, example: BookCondition.FAIR })
  @IsEnum(BookCondition)
  condition: BookCondition;
}
