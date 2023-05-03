import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'

import { Socket, Server } from 'socket.io'
import { ConnectedSocket, OnConnect, SocketController, SocketIO } from "socket-controllers";
import { Controller } from "@nestjs/common";

@WebSocketGateway({cors: '*'})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;
    async handleConnection(socket: Socket) {
        console.log('Socket connected :', socket.id);
    }
    async handleDisconnect(socket: Socket) {
        console.log('Socket disconnected:', socket.id);
    }
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void{
        console.log("chat", message);
        this.server.emit('message', message);
    }

    // @SubscribeMessage('join_game')
    // async join(@MessageBody() message: string): Promise<void>{
    //   console.log("just join the game in socket.ts!!");
    //     this.server.on("custom_event", (data: any) => {
    //         console.log("Data in join game socket.ts ", data)
    //     });
    //     // Find/Create game la 
    //     //Broadcast to pending user gameid
    //     //If 2 joined send start
    // }

    @SubscribeMessage("join_game")
    public async joinGame( io: Server, socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("IN SOCKET CONTROLER")
    console.log("New User joining room: ", message);

    if (!socket)
        console.log("nope the socket dosen't exist");
    else
        console.log("yeass the socket exist");
    console.log("la 1");
    if (socket)
    {
        const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);
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
            
            if (io.sockets.adapter.rooms.get(message.roomId).size === 2) {
                socket.emit("start_game", { start: true, symbol: "x" });
                socket
                .to(message.roomId)
                .emit("start_game", { start: false, symbol: "o" });
            }
        }
    }
  }

}