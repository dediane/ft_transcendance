import { Body, Get, Controller, NotFoundException, Response, Post, Request, UseGuards, Redirect, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { FortyTwoAuthGuard } from './guards/fortytwo_auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {

constructor(
    private readonly authService: AuthService,
    private userService: UserService
  ) {}
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

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async register(@Response() res, @Request() req) {
    const { otpAuthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        req.user,
      );

    return res.json(
      await this.authService.generateQrCodeDataURL(otpAuthUrl),
    );
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(@Request() req, @Body() body) {
    const isCodeValid =
      this.authService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        req.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userService.turnOnTwoFactorAuthentication(req.user.id);
  }

  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body) {
    console.log(body)
    console.log(request.user)
    
    const isCodeValid = this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authService.loginWith2fa(request.user);
  }
}
