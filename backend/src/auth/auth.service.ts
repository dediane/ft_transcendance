import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { User } from 'src/user/entities/user.entity';
var QRCode = require('qrcode');

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findOnebyEmail(email);
        if (user && await bcrypt.compare(password, user.password)) {
            delete user.password
            return {status: true, user};
        }
        //add 2fa
        return {status: false, error: "Invalid credential"};
    }

    async login(user: any) {
        return {
            access_token: this.jwtService.sign({...user}), 
            status: true
        };
    }

    login42(req) {
        if (!req.user) {
          return {status: false};
        }
    
        return {
          status:true,
          message: 'User information from 42',
          user: req.user,
          access_token: this.jwtService.sign(req.user)
        };
      }

      async generateTwoFactorAuthenticationSecret(user: User): Promise<{secret: string, otpAuthUrl: any}> {
        const secret = authenticator.generateSecret();
        const otpAuthUrl = authenticator.keyuri(user.email, 'AUTH_APP_NAME', secret);
        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        return {secret, otpAuthUrl}
      }

      async generateQrCodeDataURL(otpAuthUrl: string) {
        return QRCode.toDataURL(otpAuthUrl);
      }

      isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        return authenticator.verify({
          token: twoFactorAuthenticationCode,
          secret: user.secret2fa,
        });
      }

      async loginWith2fa(userWithoutPsw: Partial<User>) {
        const payload = {
          email: userWithoutPsw.email,
          is2fa: !!userWithoutPsw.is2fa,
          isTwoFactorAuthenticated: true,
        };
    
        return {
          email: payload.email,
          access_token: this.jwtService.sign(payload),
        };
      }

}
// //const jwt = await this.jwtService.signAsync({id: user.id});
// const jwt = this.jwtService.sign({id: user.id})
// console.log(jwt)
// //return jwt;
