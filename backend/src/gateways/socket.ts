import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'

import { Socket, Server } from 'socket.io'

@WebSocketGateway({cors: '*'})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server;
    async handleConnection(socket: Socket) {
        console.log('Socket connected:', socket.id);
    }
    async handleDisconnect(socket: Socket) {
        console.log('Socket disconnected:', socket.id);
    }
    @SubscribeMessage('message')
    handleMessage(@MessageBody() message: string): void{
        console.log("chat", message);
        this.server.emit('message', message);
    }

    @SubscribeMessage('join_game')
    async join(@MessageBody() message: string): Promise<void>{

        
        // Find/Create game
        //Broadcast to pending user gameid
        //If 2 joined send start
    }
}