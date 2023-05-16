import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './channel/entities/channel.entity';
import { Game } from './game/entities/game.entity';
import { Message } from './message/entities/message.entity';
import { User } from './user/entities/user.entity';
import { FriendRequest } from './friend/entities/friend.entity';

@Module({
    imports: [
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [User, Game, Channel, Message, FriendRequest],
          synchronize: true,
        }),
      }),
    ],
  })
  export class DatabaseModule {}