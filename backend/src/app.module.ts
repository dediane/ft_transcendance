import { Module, Next } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController, ProfileController } from './controllers';
import { AppService } from './services/app.service';
import { EventsGateway } from './gateways/socket';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({ 
      envFilePath: ['.env'] ,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        SECRET_JWT: Joi.string().required() 
      })
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.SECRET_JWT,
      signOptions: {expiresIn: '1d'}
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, ProfileController],
  providers: [AppService, EventsGateway, AuthService],
})
export class AppModule {}
