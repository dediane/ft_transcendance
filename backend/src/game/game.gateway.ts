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

type GameStruct = {
  id: number;
  userA: Socket;
  userB: Socket;
  scoreA: number;
  scoreB: number;
  infoA: User;
  infoB: User;
  spectators: string[];
}

type puckd = {
  width: number,
  height: number,
  x: number,
  y: number,
  r: 12,
  angle: number,
  xspeed: number,
  yspeed: number,
  puckspeed: number,
};


@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  

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
    console.log('Socket connected:', socket.id);
  }

 async handleDisconnect(socket: Socket) {
  console.log('Socket disconnected:', socket.id);
  this.server.emit('disconnect users');
}

@SubscribeMessage('init data puck')
async handleJoinServer(socket: Socket, w: number, h: number, a: number)
{
  console.log('init data puck');

  this.server.emit('init data'); // send to the game
}

}

// @WebSocketGateway()
// export class GameGateway {
//   constructor(private readonly GameService: GameService) {
//   }


//     private players: Socket[] = [];
      
//     async handleConnection(client: Socket) {
//       console.log(`Client from gamegateway ${client.id} connected`);
//       this.players.push(client);
//       if (this.players.length === 2) {
//         this.GameService.startGame();
//       }
//     }

//   @SubscribeMessage('createGame')
//   create(@MessageBody() createGameDto: CreateGameDto) {
//     return this.GameService.create(createGameDto);
//   }

//   @SubscribeMessage('findAllGame')
//   findAll() {
//     return this.GameService.findAll();
//   }

//   @SubscribeMessage('findOneGame')
//   findOne(@MessageBody() id: number) {
//     return this.GameService.findOne(id);
//   }

//   @SubscribeMessage('updateGame')
//   update(@MessageBody() updateGameDto: UpdateGameDto) {
//     return this.GameService.update(updateGameDto.id, updateGameDto);
//   }

//   @SubscribeMessage('removeGame')
//   remove(@MessageBody() id: number) {
//     return this.GameService.remove(id);
//   }

//   @SubscribeMessage('join_game')
//   async join(@MessageBody() message: string): Promise<void>{
//     console.log("just join the game in gamegate.ts!!");
//       // je pense pas que ca va etre la 
//       // Find/Create game
//       //Broadcast to pending user gameid
//       //If 2 joined send start
//   }
// }

