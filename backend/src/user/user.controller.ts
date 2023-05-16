import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

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

  @UseGuards (JwtAuthGuard)
  @Post('avatar')
  async uploadAvatar(@Body() body: any, @Request() req) {
    // Handle image upload logic here
    console.log('Image uploaded:', body.img_base64);
    if(!body.img_base64)
      return { status: false, error: 'Image not provided' };
    console.log(req.user.id)
    await this.userService.updateAvatar(req.user.id, body.img_base64);
    return { status: true };
  }
}