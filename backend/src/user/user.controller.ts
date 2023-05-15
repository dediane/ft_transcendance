import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';

import { prependOnceListener } from 'process';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(Jwt2faAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards (JwtAuthGuard)
  @Get()
  findOne(@Param() params: string) {
    return this.userService.findOnebyEmail(params);
  }

  @UseGuards (JwtAuthGuard)
  @Post('username')
  async findByUsername(@Body() req: any) {
    if (!req.username)
      return { error: 'Username not provided' };
    return await this.userService.findByUsername(req.username);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}