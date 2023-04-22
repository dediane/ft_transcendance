import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { FortyTwoStrategy } from './login42.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:
  [ 
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret:`${process.env.SECRET_JWT}`,
      signOptions: {expiresIn: '1d'}}),
    UserModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, FortyTwoStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
