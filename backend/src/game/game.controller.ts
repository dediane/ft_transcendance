import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Socket, Server } from 'socket.io';
import { ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';


@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gameService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gameService.update(+id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gameService.remove(+id);
  }

  @SubscribeMessage("join_game")
  public async joinGame(io: Server, @ConnectedSocket() socket: Socket, @MessageBody() message: any){
    console.log("IN GAME CONTROLER")
    console.log("New User joinning the room: ", message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id)
    if (socketRooms.length > 0 || connectedSockets && connectedSockets.size === 2) 
    {
      socket.emit("room_join_error", {
        error: "Room is full please choose another room to play!"
      });
    } else {
      await socket.join(message.roomId);
      socket.emit("room_joined");
    }
  }
}



/*
import { Socket, Server } from "socket.io";
import { Controller } from "@nestjs/common";
import { WebSocketGateway } from "@nestjs/websockets";

@SocketController()
@Controller()
export class GameController{
  @OnConnect()
  public onConnection(
    @ConnectedSocket() socket : Socket,
    @SocketIO() io: Server
  ){
    console.log("New Socket connected: ", socket.id);
  }
}*/
