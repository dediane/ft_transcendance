import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { User } from 'src/user/entities/user.entity';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { number } from '@hapi/joi';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';


@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,
    // private readonly authService: AuthService,
    ) {}
  
  //Server
  @WebSocketServer()
  server: Server;

  afterInit() {} // for OnGatewayInit

  async handleConnection(socket: Socket) {
  }

 async handleDisconnect(socket: Socket) {
  this.server.emit('disconnect users game gateway');
}
}
