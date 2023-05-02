import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket } from 'socket.io';


// ici ce connect au socket 
// ici ca marche pas mdrr

@WebSocketGateway()
export class GameGateway {
  constructor(private readonly GameService: GameService) {
  }


    private players: Socket[] = [];
      
    async handleConnection(client: Socket) {
      console.log(`Client from gamegateway ${client.id} connected`);
      this.players.push(client);
      if (this.players.length === 2) {
        this.GameService.startGame();
      }
    }

  @SubscribeMessage('createGame')
  create(@MessageBody() createGameDto: CreateGameDto) {
    return this.GameService.create(createGameDto);
  }

  @SubscribeMessage('findAllGame')
  findAll() {
    return this.GameService.findAll();
  }

  @SubscribeMessage('findOneGame')
  findOne(@MessageBody() id: number) {
    return this.GameService.findOne(id);
  }

  @SubscribeMessage('updateGame')
  update(@MessageBody() updateGameDto: UpdateGameDto) {
    return this.GameService.update(updateGameDto.id, updateGameDto);
  }

  @SubscribeMessage('removeGame')
  remove(@MessageBody() id: number) {
    return this.GameService.remove(id);
  }

  @SubscribeMessage('join_game')
  async join(@MessageBody() message: string): Promise<void>{
    console.log("just join the game in gamegate.ts!!");
      // je pense pas que ca va etre la 
      // Find/Create game
      //Broadcast to pending user gameid
      //If 2 joined send start
  }
}