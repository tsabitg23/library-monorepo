import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../database/entities/user.entity';
import { BorrowBooksDto } from './dto/borrow-books.dto';
import { ReturnBookItemDto } from './dto/return-book-item.dto';
import { BorrowsService } from './borrows.service';

@ApiTags('borrows')
@Controller()
export class BorrowsController {
  constructor(private readonly borrowsService: BorrowsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('borrows')
  @ApiOperation({ summary: 'Borrow one or more books for the authenticated user' })
  @ApiResponse({ status: 201, description: 'Created loans' })
  borrowBooks(
    @CurrentUser() user: User,
    @Body() body: string[] | BorrowBooksDto,
  ) {
    const bookIds = Array.isArray(body) ? body : body.bookIds;
    return this.borrowsService.borrowBooks(user.id, bookIds);
  }

  @UseGuards(JwtAuthGuard)
  @Post('return_books')
  @ApiOperation({ summary: 'Return one or more borrowed books' })
  @ApiResponse({ status: 200, description: 'Updated loans' })
  returnBooks(
    @CurrentUser() user: User,
    @Body() returnBooksDto: ReturnBookItemDto[],
  ) {
    return this.borrowsService.returnBooks(user.id, returnBooksDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('borrows')
  @ApiOperation({ summary: 'Get the authenticated user borrow history' })
  @ApiResponse({ status: 200, description: 'Borrow history' })
  getBorrowHistory(@CurrentUser() user: User, @Query('search') search?: string) {
    return this.borrowsService.findBorrowHistory(user.id, search);
  }
}
