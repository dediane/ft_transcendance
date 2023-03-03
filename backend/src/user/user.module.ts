import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Game } from 'src/game/entities/game.entity';
import { Message } from 'src/message/entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Message])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
