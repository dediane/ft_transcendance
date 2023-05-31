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
            delete user.avatar
            return {status: true, user};
        }
        //add 2fa
        return {status: false, error: "Invalid credential"};
    }

    async login(user: any) {
        return {
            access_token: this.jwtService.sign({...user}),
            otp_active: user.is2fa ? true : false, 
            status: true
        };
    }
    

    login42(req :any) {
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
        // console.log("MYUSER=", user)
        await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
        return {secret, otpAuthUrl}
      }

      async generateQrCodeDataURL(otpAuthUrl: string) {
        return QRCode.toDataURL(otpAuthUrl);
      }

      async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
        const db_user = await this.usersService.findOnebyEmail(user.email)
        //console.log("LO<g",twoFactorAuthenticationCode, user.secret2fa)
        return  authenticator.verify({
          token: twoFactorAuthenticationCode,
          secret: db_user.secret2fa,
        });
      }

      async loginWith2fa(userWithoutPsw: Partial<User>) {
        const payload = {
          email: userWithoutPsw.email,
          id: userWithoutPsw.id,
          is2fa: !!userWithoutPsw.is2fa,
          isTwoFactorAuthenticated: true,
        };
    
        return {
          email: payload.email,
          access_token: this.jwtService.sign(payload),
        };
      }
}
