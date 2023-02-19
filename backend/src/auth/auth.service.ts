import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService){}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findPassword(email);
        console.log(password);
        console.log(user.password);
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    async login(userId: number) {
        const payload = {sub: userId}
        // const access_token = this.jwtService.sign(payload, { secret: process.env.SECRET_JWT, expiresIn: "1d"})
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
// //const jwt = await this.jwtService.signAsync({id: user.id});
// const jwt = this.jwtService.sign({id: user.id})
// console.log(jwt)
// //return jwt;
