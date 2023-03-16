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

}
// //const jwt = await this.jwtService.signAsync({id: user.id});
// const jwt = this.jwtService.sign({id: user.id})
// console.log(jwt)
// //return jwt;
