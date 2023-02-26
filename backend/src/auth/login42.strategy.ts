import { Strategy, done } from 'passport-42';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { VerifyCallback } from 'passport-jwt';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
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
    done
  ): Promise<any> {
    const {first_name, last_name, email, img_url, id } = profile._json;
    const user = { first_name, last_name, email, img_url, id }
    
    //Save user here 

    console.log(user)
    done(null, user);
  }
}