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
    const game = this.GameRepository.create(createGameDto);
    return this.GameRepository.save(game);
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

  async findOne(id: number) {
    const game = await this.GameRepository
      .createQueryBuilder('game')
      .where('game.id = :id', { id })
      .leftJoinAndSelect('game.player1', 'player1')
      .leftJoinAndSelect('game.player2', 'player2')
      .select(['game.id', 'player1.username', 'player2.username', 'game.score1', 'game.score2'])
      .getOne();
    return game;
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.GameRepository.findOne({ where: { id } });
    if (!game) {
      throw new Error(`Channel with ID ${id} not found`);
    }
    
    Object.assign(game, updateGameDto);
    return this.GameRepository.save(game);
  }

  async remove(id: number) {
    await this.GameRepository.delete(id);
  }
  startGame()
  {
    return 'This action begin a game';
  }
}
