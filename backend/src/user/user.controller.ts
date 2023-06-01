import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request,  UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { get } from 'http';
import { FortyTwoAuthGuard } from 'src/auth/guards/fortytwo_auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(Jwt2faAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(Jwt2faAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('avatar')
  getAvatar(@Request() req) {
    return this.userService.getAvatar(req.user.username);
  }

  @UseGuards(Jwt2faAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(Jwt2faAuthGuard)
  @UseGuards (JwtAuthGuard)
  @Get()
  findOne(@Param() params: string) {
    return this.userService.findOnebyEmail(params);
  }

  @UseGuards(Jwt2faAuthGuard)
  @UseGuards (JwtAuthGuard)
  @Post('username')
  async findByUsername(@Body() req: any) {
    if (!req.username)
      return { error: 'Username not provided' };
    return await this.userService.findOnebyId2(req.username);
  }

  @UseGuards(Jwt2faAuthGuard)
  @UseGuards (JwtAuthGuard)
  @Post('avatar')
  async uploadAvatar(@Body() body: any, @Request() req) {
    // Handle image upload logic here
    if(!body.img_base64)
      return { status: false, error: 'Image not provided' };
    // console.log(req.user.id)
    await this.userService.updateAvatar(req.user.id, body.img_base64);
    return { status: true };
  }

  @UseGuards ( Jwt2faAuthGuard )
  @UseGuards ( JwtAuthGuard )
  @Post('updateusername')
  async updateUsername(@Body() body: any, @Request() req: any) {
    if (!body.newusername)
      return {  status: false, error: 'No username provided' };
    const res = await this.userService.findAndUpdateUserByUsername(body.username, body.newusername, req.user.id)
    if (res == false)
      return { status: false, error: 'Username already taken' };
    else 
      return ({status: true, message: "Username successfully updated"});
  }
}
