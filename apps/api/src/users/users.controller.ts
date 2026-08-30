import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from '../database/entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: HttpStatus.CREATED, type: User })
  register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.usersService.register(registerUserDto);
  }

  @Put(':user_id/update')
  @ApiOperation({ summary: "Update a user's name and phone" })
  @ApiParam({ name: 'user_id' })
  @ApiResponse({ status: HttpStatus.OK, type: User })
  update(
    @Param('user_id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(userId, updateUserDto);
  }

  @Put(':user_id/update_password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Update a user's password" })
  @ApiParam({ name: 'user_id' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  updatePassword(
    @Param('user_id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    return this.usersService.updatePassword(userId, updatePasswordDto);
  }
}
