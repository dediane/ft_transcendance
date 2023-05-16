import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { Game } from 'src/game/entities/game.entity';
import { Message } from 'src/message/entities/message.entity';
import { FriendRequest } from 'src/friend/entities/friend.entity';
import { SearchController } from 'src/search/search.controller';
import { FriendController } from 'src/friend/friend.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Message, FriendRequest])],
  controllers: [UserController, SearchController, FriendController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
