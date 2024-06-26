import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class Jwt2faStrategy extends PassportStrategy(Strategy, 'jwt-2fa') {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_JWT,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findOnebyEmail(payload.email);
    // console.log("eee", user)
    if(!user)
      return;
    if (!user.is2fa) {
      return user;
    }
    if (payload.isTwoFactorAuthenticated) {
      return user;
    }
  }
}
