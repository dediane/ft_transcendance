import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {

  constructor(
    @InjectRepository(Game)
    private readonly GameRepository:Repository<Game>)
  {
  }

  create(createGameDto: CreateGameDto) {
    return 'This action adds a new game';
  }

  async findAll() {
    const games = await this.GameRepository
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.player1', 'player1')
    .leftJoinAndSelect('game.player2', 'player2')
    .select(['game.id', 'player1.username', 'player2.username', 'game.score1', 'game.score2'])
    .getMany();
    return games;
    //return `This action returns all game`;
  }

  findOne(id: number) {
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
  startGame()
  {
    return 'This action begin a game';
  }
}
