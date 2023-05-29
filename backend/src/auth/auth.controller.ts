import { Body, Get, Controller, NotFoundException, Response, Post, Request, UseGuards, Redirect, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { FortyTwoAuthGuard } from './guards/fortytwo_auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Jwt2faAuthGuard } from './guards/jwt-2fa.guard';

const baseURL = "http://localhost:3000";

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private userService: UserService,
    ) {}
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req :any) {
      if (!req.user.status){
        return (req.user)}
        return await this.authService.login(req.user.user);
      }

  @Get('42')
  @UseGuards(FortyTwoAuthGuard)
  async auth(@Request() req :any) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect("http://localhost:3000", 302)
  async callback42(@Request() req :any) {
    const {status, access_token} = this.authService.login42(req);
    if(!status)
      return { url: 'http://localhost:3000/login' };
    return { url: 'http://localhost:3000/auth?code=' + access_token };
    //Send tokent to front end
  }

  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  @UseGuards(Jwt2faAuthGuard)
  async register(@Response() res, @Request() req) {
    const user = await this.userService.findOnebyEmail(req.user.email);
    const { otpAuthUrl } =
      await this.authService.generateTwoFactorAuthenticationSecret(
        user,
      );

    return res.json(
      await this.authService.generateQrCodeDataURL(otpAuthUrl),
    );
  }

  @Post('2fa/turn-on')
  @UseGuards(JwtAuthGuard)
  async turnOnTwoFactorAuthentication(@Request() req, @Body() body) {
    const isCodeValid = await
      this.authService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        req.user,
      );
    if (!isCodeValid) {
      return ({status: false, message: "2FA code is invalid"})
       throw new UnauthorizedException('Wrong authentication code');

    }
    await this.userService.turnOnTwoFactorAuthentication(req.user.id);
    return ({status: true, message: "2FA is now active"})
  }

  @Post('2fa/turn-off')
  @UseGuards(Jwt2faAuthGuard)
  async turnOffTwoFactorAuthentication(@Request() req, @Body() body) {
    const isCodeValid = await
      this.authService.isTwoFactorAuthenticationCodeValid(
        body.twoFactorAuthenticationCode,
        req.user,
      )

    if (!isCodeValid) {
      return ({status: false, message: "2FA code is invalid"})
      throw new UnauthorizedException('Wrong authentication code');

    }
    await this.userService.turnOffTwoFactorAuthentication(req.user.id);
    return ({status: true, message: "2FA is disabled"})

  }


  @Get('2fa/is-enabled')
  @UseGuards(JwtAuthGuard)
  async is2fa(@Request() req) {
    return req.user.is2fa;
  }


  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async authenticate(@Request() request, @Body() body) {
    console.log("OTP attemps")
    if(!body.twoFactorAuthenticationCode)
      return ({status: false, message: "2FA code is invalid"})
    const isCodeValid = await this.authService.isTwoFactorAuthenticationCodeValid(
      body.twoFactorAuthenticationCode,
      request.user,
    );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    return this.authService.loginWith2fa(request.user);
  }
}
