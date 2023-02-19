import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
constructor(
  private readonly authService: AuthService,
  private jwtService: JwtService
  ) {}

  @Post()
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ){
      const user = this.authService.validateUser(email, password)
  }
}
