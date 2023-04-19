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
import { MessageService } from 'src/message/message.service';
import { ChannelService } from 'src/channel/channel.service';

import { CreateMessageDto } from 'src/message/dto/create-message.dto';
@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService, // Inject your MessageService here
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
  ) {}

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
    const users = await this.messageService.findAll();
    // const user = await this.userService.findOne("balkis@gmail.com");
  }

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
}
