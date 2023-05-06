import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io';
// import { OnMessage } from 'socket-controllers';

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

    

    //// Game Side
    @SubscribeMessage("join_game")
    public async joinGame( 
          socket: Socket,
          message: string) 
        {
            console.log("IN SOCKET CONTROLER")
            console.log("New User joining room: ", message);
            this.server.emit('game');
            console.log("room message id: ", message);
            if (socket)
              console.log("socket exist");
            else
              console.log("not exist T-T , sockety");
            console.log("la 1");
            const connectedSockets = this.server.sockets.adapter.rooms.get(message);
            if (connectedSockets)
            console.log("lalalala i existe");
            else
            console.log("no i dont want to existe")
            console.log("la 2");
            const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
            console.log("la existe");
            if ( socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2))
            {
                socket.emit("room_join_error, you gonna be a spectator", {
                    error: "Room is full please choose another room to play!",
                });
            } else {
                await socket.join(message);
                socket.emit("room_joined");
                
                if (this.server.sockets.adapter.rooms.get(message).size === 2) 
                { // si on a deux user start game 
                    console.log("deux users");
                    socket.emit("start_game", {}); // ici envoyer au front end change page in homegame et lancer le jeu
                    socket.to(message)
                    .emit("start_game", { start: false, symbol: "o" });
                }
            }
        }
    @SubscribeMessage('launch ball')
    async handleJoinServer(socket: Socket, gamedata: {}) {
      console.log('launch ball');

      this.server.emit('update ball');
    
    }
    ///// Game Side
}