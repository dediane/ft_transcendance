import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { channel } from 'diagnostics_channel';
import { Socket, Server } from 'socket.io';
import io from 'socket.io-client';

@WebSocketGateway({ cors: '*' })
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
  handleMessage(@MessageBody() message: string): void {
    console.log(message);
    this.server.emit('message', message);
  }
}
// const socket = io("http://localhost:8000")


// const users: any[] = [];

// const messages = {
//   general: [],
//   random: [],
//   jokes: [],
//   javascript: [],
// };

// socket.on('connection', (socket) => {
//   //grace a socket.on, genere un nouveau socket qui represente une personne

//   socket.on('join server', (username) => {
//     const user = {
//       username,
//       id: socket.id,
//     };
//     users.push(user);
//     socket.emit('new user', users);
//   });
//   // });

//   socket.on('join room', (roomName, cb) => {
//     socket.join(roomName);
//     cb(messages[roomName]);
//   });

//   socket.on('send message', ({ content, to, sender, chatName, isChannel }) => {
//     if (isChannel) {
//       const payload = {
//         content,
//         chatName,
//         sender,
//       };
//       socket.to(to).emit('new message', payload);
//     } else {
//       const payload = {
//         content,
//         chatName: sender,
//         sender,
//       };
//       socket.to(to).emit('new message', payload);
//     }
//     if (messages[chatName]) {
//       messages[chatName].push({
//         sender,
//         content,
//       });
//     }
//   });
// });
