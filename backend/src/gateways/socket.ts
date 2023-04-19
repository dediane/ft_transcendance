// import {
//     MessageBody,
//     SubscribeMessage,
//     WebSocketGateway,
//     WebSocketServer,
//     OnGatewayConnection,
//     OnGatewayDisconnect
// } from '@nestjs/websockets'

// import { Socket, Server } from 'socket.io'

// @WebSocketGateway({cors: '*'})
// export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
//     @WebSocketServer()
//     server;
//     async handleConnection(socket: Socket) {
//         console.log('Socket connected:', socket.id);
//     }
//     async handleDisconnect(socket: Socket) {
//         console.log('Socket disconnected:', socket.id);
//     }
//     @SubscribeMessage('message')
//     handleMessage(@MessageBody() message: string): void{
//         this.server.emit('message', message);
//     }

//     @SubscribeMessage('join_game')
//     async join(@MessageBody() message: string): Promise<void>{

//         // Find/Create game
//         //Broadcast to pending user gameid
//         //If 2 joined send start
//     }
// }

///////////// UP Diane version

// // //////////// DOWN Marie version

import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userService: UserService) {} // Inject your UserService here

  @WebSocketServer()
  server: Server;

  private users: any[] = [];
  private messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: [],
  };

  async handleDisconnect(socket: Socket) {
    console.log('Socket disconnected:', socket.id);
    this.users = this.users.filter((u) => u.id !== socket.id);
    this.server.emit('new user', this.users);
  }
  async handleConnection(socket: Socket) {
    console.log('Socket connected:', socket.id);
    // const users = await this.userService.findAll();
    // const user = await this.userService.findOne("balkis@gmail.com");
  }

  // @SubscribeMessage('join server')
  // handleJoinServer(socket: Socket, username: string) {
  //   console.log('join server');
  //   const user = {
  //     username,
  //     id: socket.id,
  //   };
  //   console.log(socket.id, 'just joined server');

  //   this.users.push(user);
  //   this.server.emit('new user', this.users); // broadcast to all connected sockets
  // }

  @SubscribeMessage('join server')
  handleJoinServer(socket: Socket, username: string) {
    console.log('join server');
    const user = {
      username,
      sockets: [socket.id],
    };
    console.log(socket.id, 'just joined server');

    const existingUser = this.users.find((u) => u.username === username);
    if (existingUser) {
      existingUser.sockets.push(socket.id);
    } else {
      this.users.push(user);
    }

    this.server.emit('new user', this.users); // broadcast to all connected sockets
  }

  @SubscribeMessage('join room')
  handleJoinRoom(socket: Socket, roomName: string) {
    socket.join(roomName);
    if (!this.messages[roomName]) {
      this.messages[roomName] = []; // add new room if it doesn't exist
    }
    console.log(
      socket.id,
      'just joined room',
      roomName,
      this.messages[roomName],
    );
    socket.emit('join room', this.messages[roomName]);
  }

  @SubscribeMessage('send message')
  async handleMessage(socket: Socket, data: any) { // Make this function async to allow database calls
    const { content, to, sender, chatName, isChannel } = data;
    console.log(socket.id, "just sent a message", data)

    if (isChannel) {
      const payload = {
        content,
        chatName,
        sender,
      };
      socket.to(to).emit('new message', payload);
    //   socket.to(chatName).emit('new message', payload);
    } else {
      const payload = {
        content,
        chatName: sender,
        sender,
      };
      socket.to(to).emit('new message', payload);
    //   socket.to(chatName).emit('new message', payload);

    }
    if (this.messages[chatName]) {
      this.messages[chatName].push({
        sender,
        content,
      });
    }

    // Save the message to the database
    // const user = await this.userService.findOneByUsername(sender);
    // await this.userService.saveMessage(user.id, to, content);
  }

  // @SubscribeMessage('send message')
  // async handleMessage(socket: Socket, data: any) {
  //   // Make this function async to allow database calls
  //   const { content, to, sender, chatName, isChannel } = data;
  //   console.log(socket.id, 'just sent a message', data);

  //   // if (isChannel) {
  //   const payload = {
  //     content,
  //     chatName,
  //     sender,
  //   };
  //   // const existingUser = this.users.find((u) => u.username === sender);

  //   // socket.join(sender);
  //   socket.to(to).emit('new message', payload);
  //   // } else {
  //   //   const payload = {
  //   //     content,
  //   //     chatName: sender,
  //   //     sender,
  //   //   };
  //   //   socket.to(to).emit('new message', payload);

  //   //   // Get all sockets associated with the user id/username and emit the message to them
  //     // const userSockets = this.users.filter((user) => user.username === to);
  //     // userSockets.forEach((userSocket) => {
  //     //   socket.to(userSocket).emit('new message', payload);
  //     // });
  //   // }

  //   if (this.messages[chatName]) {
  //     this.messages[chatName].push({
  //       sender,
  //       content,
  //     });
  //   }

  //   // Save the message to the database
  //   // const user = await this.userService.findOneByUsername(sender);
  //   // await this.userService.saveMessage(user.id, to, content);
  // }
}

// // // import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
// // // import { Socket, Server } from 'socket.io';

// // // @WebSocketGateway({ cors: true })
// // // export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
// // //   @WebSocketServer()
// // //   server: Server;

// // //   private users: any[] = [];
// // //   private messages = {
// // //     general: [],
// // //     random: [],
// // //     jokes: [],
// // //     javascript: [],
// // //   };

// // //   async handleConnection(socket: Socket) {
// // //     console.log('Socket connected:', socket.id);
// // //   }

// // //   async handleDisconnect(socket: Socket) {
// // //     console.log('Socket disconnected:', socket.id);
// // //     this.users = this.users.filter((u) => u.id !== socket.id);
// // //     this.server.emit('new user', this.users);
// // //   }
// // //   //     async handleConnection(socket: Socket) {
// // // //         console.log('Socket connected:', socket.id);
// // // //     }
// // // //     async handleDisconnect(socket: Socket) {
// // // //         console.log('Socket disconnected:', socket.id);
// // // //     }

// // //   @SubscribeMessage('join server')
// // //   handleJoinServer(socket: Socket, username: string) {
// // //     console.log('join server');
// // //     const user = {
// // //       username,
// // //       id: socket.id,
// // //     };
// // //     this.users.push(user);
// // //     socket.emit('new user', this.users);
// // //   }

// // //   @SubscribeMessage('join room')
// // //   handleJoinRoom(socket: Socket, data: any) {
// // //     const { roomName } = data;
// // //     socket.join(roomName);
// // //     socket.emit('room joined', this.messages[roomName]);
// // //   }

// // //   @SubscribeMessage('send message')
// // //   handleMessage(socket: Socket, data: any) {
// // //     const { content, to, sender, chatName, isChannel } = data;
// // //     if (isChannel) {
// // //       const payload = {
// // //         content,
// // //         chatName,
// // //         sender,
// // //       };
// // //       socket.to(to).emit('new message', payload);
// // //     } else {
// // //       const payload = {
// // //         content,
// // //         chatName: sender,
// // //         sender,
// // //       };
// // //       socket.to(to).emit('new message', payload);
// // //     }
// // //     if (this.messages[chatName]) {
// // //       this.messages[chatName].push({
// // //         sender,
// // //         content,
// // //       });
// // //     }
// // //   }
// // // }

// // // // //BEFORE

// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// // import { channel } from 'diagnostics_channel';
// import { Socket, Server } from 'socket.io';

// let users = [];

// const messages = {
//     general: [],
//     random: [],
//     jokes: [],
//     javascript: [],
//   };

//   const express = require('express');
//   const http = require('http');
//   const app = express();
//   const server = http.createServer(app)
//   const socket = require('socket.io');
//   const io = socket(server);

//   io.on('connection', (socket) => {
//       //grace a socket.on, genere un nouveau socket qui represente une personne

//       socket.on('join server', (username: string) => {
//           console.log('join server');
//           const user = {
//               username,
//               id: socket.id,
//           };
//           users.push(user);
//           socket.emit('new user', users);
//       });
//     //   });

//       socket.on('join room', (roomName : string, cb) => {
//           socket.join(roomName);
//           cb(messages[roomName]);
//       });

//       socket.on('send message', ({ content, to, sender, chatName, isChannel }) => {
//           if (isChannel) {
//               const payload = {
//                   content,
//                   chatName,
//                   sender,
//               };
//               socket.to(to).emit('new message', payload);
//           } else {
//               const payload = {
//                   content,
//                   chatName: sender,
//                   sender,
//               };
//               socket.to(to).emit('new message', payload);
//           }
//           if (messages[chatName]) {
//               messages[chatName].push({
//                   sender,
//                   content,
//               });
//           }
//       });
//       socket.on('disconnect', () => {
//           users = users.filter((u) => u.id !== socket.id);
//           socket.emit('new user', users);
//     });});
// @WebSocketGateway({ cors: '*' })
// // export class ChatGateway {
// export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server;

//   async handleConnection(socket: Socket) {
//     console.log('Socket connected:', socket.id);
//   }

//   async handleDisconnect(socket: Socket) {
//     console.log('Socket disconnected:', socket.id);
//   }
//   @SubscribeMessage('message')
//   handleMessage(@MessageBody() message: string): void {
//     console.log(message);
//     this.server.emit('message', message);

//   }
// }
