import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findPassword(email);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(userId: number) {
        const payload = {sub: userId}
        return {
            access_token: this.jwtService.sign(payload)
        };
    }

    async login42(req) {
        if (!req.user) {
          return 'No user from 42';
        }
    
        return {
          message: 'User information from 42',
          user: req.user,
          access_token: this.jwtService.sign(req.user)
        };
      }

}
// //const jwt = await this.jwtService.signAsync({id: user.id});
// const jwt = this.jwtService.sign({id: user.id})
// console.log(jwt)
// //return jwt;
