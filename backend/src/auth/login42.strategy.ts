import { Strategy, done } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCallback } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private readonly userService: UserService) {
    super({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: '/auth/callback'
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    // console.log(profile._json);
    const {first_name, last_name, email, image, id, login } = profile._json;
    const generatedpwd = Math.random().toString(36).substring(2);
    const user = { first_name, last_name, email, img_url: image.link, id, username:login}
    const existingUser = await this.userService.findOnebyEmail(email)
    //delete existingUser.secret2fa
    console.log("existingUser", existingUser)
    if (existingUser){
      return done(null, {...existingUser})
    }

    const newuser = {
      username: login,
      login42: login,
      email: email,
      password: generatedpwd,
      avatar: image.link,
      wins: 0,
      losses: 0,
      is2fa: false,
    }
    const lala = await this.userService.create(newuser);
    console.log(lala);
    done(null, user);
  }
}