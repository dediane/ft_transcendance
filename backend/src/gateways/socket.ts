import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io';
import { OnMessage } from 'socket-controllers';

import { Controller } from "@nestjs/common";
import { ConnectedSocket } from '@nestjs/websockets'


@WebSocketGateway({cors: '*'})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server : Server;
    async handleConnection(socket: Socket) {
        console.log('Socket connected :', socket.id);
        return (socket);
    }
    async handleDisconnect(socket: Socket) {
        console.log('Socket disconnected:', socket.id);
    }
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void{
        console.log("chat", message);
        this.server.emit('message', message);
    }

    // @SubscribeMessage('start')
    // async join(@MessageBody() socket: Socket): Promise<void>{
    //   console.log("just START the game in socket.ts!!");
    //     // Find/Create game la 
    //     //Broadcast to pending user gameid
    //     //If 2 joined send start
    // }
    

    
    //@SubscribeMessage("join_game")
  
    public async joinGame( 
        io: Server, socket: Socket,
        @MessageBody() message: any) 
        {
            console.log("IN SOCKET CONTROLER")
            console.log("New User joining room: ", message);
            this.server.emit('game');
            console.log("room message id: ", message.roomId);
            if (socket)
            console.log("socket exist");
            else
            console.log("not exist T-T");
            console.log("la 1");
            const connectedSockets = this.server.sockets.adapter.rooms.get(message.roomId);
            if (connectedSockets)
            console.log("lalalala i existe");
            else
            console.log("no i dont want to existe")
            console.log("la 2");
            const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
            console.log("la 3");
            if ( socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2))
            {
                socket.emit("room_join_error, you gonna be a spectator", {
                    error: "Room is full please choose another room to play!",
                });
            } else {
                await socket.join(message.roomId);
                socket.emit("room_joined");
                
                if (io.sockets.adapter.rooms.get(message.roomId).size === 2) 
                { // si on a deux user start game 
                    socket.emit("start_game", {}); // ici envoyer au front end change page in homegame et lancer le jeu
                    socket.to(message.roomId)
                    .emit("start_game", { start: false, symbol: "o" });
                }
            }
        }
        /*
        @SubscribeMessage("join_game")
        @OnMessage('join_game')
    async joinGame(io, socket, message) {
    console.log('New User joining room: ', message);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
    const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);

    if (socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2)) {
      socket.emit('room_join_error', {
        error: 'Room is full please choose another room to play!',
      });
    } else {
      await socket.join(message.roomId);
      socket.emit('room_joined');

      if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {
        socket.emit('start_game', { start: true, symbol: 'x' });
        socket.to(message.roomId).emit('start_game', { start: false, symbol: 'o' });
      }
    }
  }*/









    @SubscribeMessage('launch ball')
    async handleJoinServer(socket: Socket, gamedata: {}) {
      console.log('launch ball');

      this.server.emit('update ball');
    
    }

}