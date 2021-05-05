import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { getConnection } from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDto } from './dto/user.dto';
import { UserDetails } from './user.details.entity';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':id')
  async getUser(@Param() id: number): Promise<UserDto> {
    const user = await this._userService.get(id);
    return user;
  }

  @Get()
  async getUsers(): Promise<UserDto[]> {
    const users = await this._userService.getAll();
    return users;
  }

  @Post()
  async createUser(@Body() user: User): Promise<UserDto> {
    user.details = new UserDetails();
    const repo = await getConnection().getRepository(Role);
    const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
    user.roles = [defaultRole];

    const createdUser = await this._userService.create(user);
    return createdUser;
  }

  @Patch(':id')
  async updateUser(@Param() id: number, @Body() user: User): Promise<boolean> {
    await this._userService.update(id, user);
    return true;
  }

  @Delete(':id')
  async deleteUser(@Param() id: number) {
    await this._userService.delete(id);
    return true;
  }
}
