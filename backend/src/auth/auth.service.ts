import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService,
    ){}

    async validate(email: string, password: string): Promise<any> {
        const user = this.usersService.findPassword(email);
        if (!user) {
            throw new BadRequestException('invalid credentials')
        }
        if (!await bcrypt.compare(password, (await user).password)) {
            throw new BadRequestException('Invalid credentials')
        }
        const jwt = await this.jwtService.signAsync(id: user.id)
        return user;
    }
}
