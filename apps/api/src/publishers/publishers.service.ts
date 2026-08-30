import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publisher } from '../database/entities/publisher.entity';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private readonly publishersRepository: Repository<Publisher>,
  ) {}

  create(createPublisherDto: CreatePublisherDto): Promise<Publisher> {
    const publisher = this.publishersRepository.create(createPublisherDto);
    return this.publishersRepository.save(publisher);
  }

  findAll(): Promise<Publisher[]> {
    return this.publishersRepository.find();
  }

  async findOne(id: string): Promise<Publisher> {
    const publisher = await this.publishersRepository.findOne({
      where: { id },
    });
    if (!publisher) {
      throw new NotFoundException(`Publisher with id ${id} not found`);
    }
    return publisher;
  }

  async update(
    id: string,
    updatePublisherDto: UpdatePublisherDto,
  ): Promise<Publisher> {
    const publisher = await this.findOne(id);
    Object.assign(publisher, updatePublisherDto);
    return this.publishersRepository.save(publisher);
  }

  async remove(id: string): Promise<void> {
    const publisher = await this.findOne(id);
    try {
      await this.publishersRepository.softRemove(publisher);
    } catch {
      throw new ConflictException('Publisher cannot be deleted');
    }
  }
}
