import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Catch, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
@Catch(HttpException)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
        usernameField: 'email'
    });
  }

  async validate(email: string, password: string): Promise<any> {
    return await this.authService.validateUser(email, password);
  }
}