import { Body, Get, Controller, NotFoundException, Post, Request, UseGuards, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { FortyTwoAuthGuard } from './guards/fortytwo_auth.guard';

@Controller('auth')
export class AuthController {
constructor(
  private readonly authService: AuthService,
  // private jwtService: JwtService
  ) {}


  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log(process.env)
      return await this.authService.login(req.user);
  }

  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  async auth(@Request() req) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  // @Redirect("http://localhost:3000", 302)
  callback42(@Request() req) {
    return this.authService.login42(req);
    //Send tokent to front end
  }
}
