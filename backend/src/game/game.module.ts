import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './entities/game.entity';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameGateway } from './game.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    GameModule
  ],

  controllers: [GameController], // a instancier 
  providers: [GameService],
  exports: [TypeOrmModule, GameService]
  // ici a demander 

})
export class GameModule {}
