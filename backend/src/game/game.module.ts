import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    GameModule
  ],

  controllers: [GameController], // a instancier 
  providers: [GameService],
  exports: [TypeOrmModule, GameService]

})
export class GameModule {}
