import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookInventoryService } from './book-inventory.service';
import { CreateBookInventoryDto } from './dto/create-book-inventory.dto';
import { UpdateBookInventoryConditionDto } from './dto/update-book-inventory-condition.dto';
import { BookInventory } from '../database/entities/book-inventory.entity';

@ApiTags('book-inventory')
@Controller('book-inventory')
export class BookInventoryController {
  constructor(private readonly bookInventoryService: BookInventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new book inventory item' })
  @ApiResponse({ status: HttpStatus.CREATED, type: BookInventory })
  create(
    @Body() createBookInventoryDto: CreateBookInventoryDto,
  ): Promise<BookInventory> {
    return this.bookInventoryService.create(createBookInventoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all book inventory items' })
  @ApiResponse({ status: HttpStatus.OK, type: [BookInventory] })
  findAll(): Promise<BookInventory[]> {
    return this.bookInventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book inventory item by id' })
  @ApiResponse({ status: HttpStatus.OK, type: BookInventory })
  findOne(@Param('id') id: string): Promise<BookInventory> {
    return this.bookInventoryService.findOne(id);
  }

  @Patch(':id/condition')
  @ApiOperation({ summary: 'Update the condition of a book inventory item' })
  @ApiResponse({ status: HttpStatus.OK, type: BookInventory })
  updateCondition(
    @Param('id') id: string,
    @Body() updateBookInventoryConditionDto: UpdateBookInventoryConditionDto,
  ): Promise<BookInventory> {
    return this.bookInventoryService.updateCondition(
      id,
      updateBookInventoryConditionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a book inventory item' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string): Promise<void> {
    return this.bookInventoryService.remove(id);
  }
}
