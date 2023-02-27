

import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
} from '@nestjs/websockets'
import { Socket, Server } from 'socket.io'

@WebSocketGateway(8001, {cors: '*'})
// export class ChatGateway {
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
        console.log(message);
        this.server.emit('message', message);
    }
}