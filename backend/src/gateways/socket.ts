import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect
  } from '@nestjs/websockets'
  import { Socket, Server } from 'socket.io'

@WebSocketGateway()
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    async handleConnection(socket: Socket) {
        console.log('Socket connected:', socket.id);
    }

    async handleDisconnect(socket: Socket) {
        console.log('Socket disconnected:', socket.id);
    }
}
