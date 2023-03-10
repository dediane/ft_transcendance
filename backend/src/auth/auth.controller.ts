import { Body, Get, Controller, NotFoundException, Post, Request, UseGuards, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { FortyTwoAuthGuard } from './guards/fortytwo_auth.guard';

@Controller('auth')
export class AuthController {
constructor(
  private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    if (!req.user.status){
      return (req.user)}
    return await this.authService.login(req.user.user);
  }

  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  async auth(@Request() req) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect("http://localhost:3000", 302)
  callback42(@Request() req) {
    const {status, access_token} = this.authService.login42(req);
    if(!status)
      return { url: 'http://localhost:3000/login' };
    return { url: 'http://localhost:3000/auth?code=' + access_token };
    //Send tokent to front end
  }
}
