import { Module, Next } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './controllers';
import { AppService } from './services/app.service';
import { EventsGateway } from './gateways/socket';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UserService } from './user/user.service';
import { ChannelModule } from './channel/channel.module';
import { MessageModule } from './message/message.module';
import { Game } from './game/entities/game.entity';
import { ChannelService } from './channel/channel.service';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule,
    ConfigModule.forRoot({ 
      envFilePath: ['.env'] ,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        SECRET_JWT: Joi.string().required(),
        isGlobal: true 
      })
    }),
    DatabaseModule,
    UserModule,
    ChannelModule,
    MessageModule,
    GameModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
