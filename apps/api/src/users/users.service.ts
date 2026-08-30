import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { hashPassword, verifyPassword } from './utils/password.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: registerUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const { password, salt } = hashPassword(registerUserDto.password);
    const user = this.usersRepository.create({
      ...registerUserDto,
      password,
      salt,
    });
    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    const saved = await this.usersRepository.save(user);
    return this.sanitize(saved);
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const user = await this.findOne(id);
    const isCurrentPasswordValid = verifyPassword(
      updatePasswordDto.currentPassword,
      user.salt,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const { password, salt } = hashPassword(updatePasswordDto.newPassword);
    user.password = password;
    user.salt = salt;
    await this.usersRepository.save(user);
  }

  private sanitize(user: User): User {
    const { password: _password, salt: _salt, ...rest } = user;
    return rest as User;
  }
}
