import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [GameController],
  providers: [GameService]
})
export class GameModule {}
