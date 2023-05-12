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
/*
@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private logger: Logger = new Logger('GameGateway');

  @SubscribeMessage('joinGame')
  handleJoinGame(client: Socket, payload: any): void {
    this.logger.log(`Player ${payload.username} has joined the game.`);
    client.broadcast.emit('playerJoined', payload.username);
  }

  @SubscribeMessage('movePaddle')
  handleMovePaddle(client: Socket, payload: any): void {
    this.logger.log(`Player ${payload.username} moved their paddle to ${payload.position}.`);
    client.broadcast.emit('paddleMoved', payload);
  }

  afterInit(server: any): void {
    this.logger.log('Initialized socket server.');
  }

  handleConnection(client: Socket, ...args: any[]): void {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
*/

/// implement puck and paddle in backend position
/*
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

///////////////  PUCK  ////////////////////
class Puckd {

  puck_data: {
    width: number;
    height: number;
    x: number;
    y: number;
    r: 12;
    angle: number;
    xspeed: number;
    yspeed: number;
    puck_speed: 8;
  }

  constructor(){}

  update() {
    this.puck_data.x = this.puck_data.x + this.puck_data.xspeed;
    this.puck_data.y = this.puck_data.y + this.puck_data.yspeed;
    //socket.emit.("update ball", this.puck_data);
  }

};

*/
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
    console.log('Socket connected from game gateways:', socket.id);
  }

 async handleDisconnect(socket: Socket) {
  console.log('Socket disconnected:', socket.id);
  this.server.emit('disconnect users');
}

UpdateBall()
{
  console.log("do something, I am a loop, in 1000 miliseconds, ill be run again")
  //if (isGamestart == false)
    return ;
  //else
  {
   // puck.update();
  }
}
@SubscribeMessage('init data puck')
async handleJoinServer(socket: Socket, w: number, h: number, a: number)
{
  console.log('init data puck');

  this.server.emit('init data'); // send to the game
}

}
/*
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

*/