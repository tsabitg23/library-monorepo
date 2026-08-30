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
import { PublishersService } from './publishers.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from '../database/entities/publisher.entity';

@ApiTags('publishers')
@Controller('publishers')
export class PublishersController {
  constructor(private readonly publishersService: PublishersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new publisher' })
  @ApiResponse({ status: HttpStatus.CREATED, type: Publisher })
  create(@Body() createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    return this.publishersService.create(createPublisherDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all publishers' })
  @ApiResponse({ status: HttpStatus.OK, type: [Publisher] })
  findAll(): Promise<Publisher[]> {
    return this.publishersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a publisher by id' })
  @ApiResponse({ status: HttpStatus.OK, type: Publisher })
  findOne(@Param('id') id: string): Promise<Publisher> {
    return this.publishersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a publisher' })
  @ApiResponse({ status: HttpStatus.OK, type: Publisher })
  update(
    @Param('id') id: string,
    @Body() updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher> {
    return this.publishersService.update(id, updatePublisherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a publisher' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string): Promise<void> {
    return this.publishersService.remove(id);
  }
}
