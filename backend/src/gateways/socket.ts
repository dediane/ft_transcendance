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
import { AuthService } from 'src/auth/auth.service'
// import AuthService from "../services/authentication-service"

import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { CreateChannelDto } from 'src/channel/dto/create-channel.dto';
@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService, // Inject your MessageService here
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    // private readonly authService: AuthService,
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

  async handleConnection(socket: Socket) {
    console.log('Socket connected:', socket.id);
    const users = await this.messageService.findAll();
  }

 async handleDisconnect(socket: Socket) {
  console.log('Socket disconnected:', socket.id);
  const userIndex = this.users.findIndex((u) => u.sockets.includes(socket.id));
  if (userIndex >= 0) {
    // Remove the socket id from the user's array of sockets
    this.users[userIndex].sockets = this.users[userIndex].sockets.filter((s) => s !== socket.id);
    console.log(`${this.users[userIndex].username}' just closed a tab: with socketid ${socket.id} `);

    // If the user has no more sockets, remove the user object from the users array
    if (this.users[userIndex].sockets.length === 0) {
      const disconnectedUser = this.users.splice(userIndex, 1)[0];
      console.log(`${disconnectedUser.username} (${disconnectedUser.id}) has disconnected`);
    }
  }
  this.server.emit('connected users', this.users);
}

@SubscribeMessage('join server')
async handleJoinServer(socket: Socket, userdata: {id: number, name: string}) {
  console.log('join server');
  const userIndex = this.users.findIndex((u) => u.id === userdata.id);
  if (userIndex >= 0) {
    // User already exists, add new socket to their existing array of sockets
    this.users[userIndex].sockets.push(socket.id);
    console.log(this.users[userIndex], 'just opened a new tab');
  } else {
    // User doesn't exist, create a new user object with a new array of sockets
    const user = {
      username: userdata.name,
      id: userdata.id,
      sockets: [socket.id],
    };
    this.users.push(user);
    console.log(user, 'just joined server');

    // RETRIEVE AND LOAD ALL MESSAGES IN ALL ROOMS FOR THIS USER
    // const usr = await this.userService.findOnebyId(userdata.id);
    // const channels = await usr.getChannels();
    // if (channels) {
    //   const channelNames = channels.map(channel => channel.name);
    //   const channelNamesStr = channelNames.join(', ');
    //   for (const channel of channels) {
    //     const channelName = channel.name;
    //     const channelMessages = await this.messageService.getMessagesForChannel(channel.id);
    //     this.messages[channelName].push(...channelMessages);
    //   }
    // }
  }
  this.server.emit('connected users', this.users);
}


  // @SubscribeMessage('create chan')
  // async handleCreateNewChan(socket: Socket, roomName: string) {
  //   if (!roomName) {
  //     throw new Error('Room name cannot be null or undefined.');
  // }
  //    if (!this.channelService.findOneByName(roomName)) //si dm ou prive ok mais sinon attention aux doublons de noms donc faire plutot par channelid
  //     {
  //     const channelDto: CreateChannelDto = {
  //       roomName
  //     };
  //     this.channelService.createChannel(channelDto);
  //   // }
  //   // this.server.emit('new chan', this.users); // broadcast to all connected sockets

  // }}


  @SubscribeMessage('create chan')
  async handleCreateNewChan(socket: Socket, datachan: any) {
    const { creator, roomName } = datachan;
    if (roomName == null) { // check if roomName is null or undefined
      socket.emit('error', 'Room name cannot be null or undefined.'); // emit an error message to the socket
    return;
    }
    console.log(`attempting (${roomName}) room creation`)
    const usr = await this.userService.findOnebyId(datachan.creator);

    const existingChannel = await this.channelService.findOneByName(roomName);
    if (!existingChannel) {
      console.log(`room (${roomName})  doesn't exist so let's create it`)
      const channelDto: CreateChannelDto = {
        name: roomName,
        members: [usr],
        admins: [usr],
        invitedUsers: [usr],
      };

    const newChannel = await this.channelService.createChannel(channelDto);

          // // Add the new channel to the creator user's channels
          // if (usr.channels) {
          //   usr.channels.push(newChannel);
          //   await this.userService.save(usr);
          // } else {
          //   console.log("user chan bug")
          //   // handle the case where usr.channels is undefined
          // }
          
      
    }
  }
  

  @SubscribeMessage('join room')
  async handleJoinRoom(socket: Socket, roomName: string) {
    //cote client mettre si bon mdp then ok call this function
    //await add to user this roomname (roomid plutot)
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
    // const { content, to, sender, chatName, isChannel } = data;
    

    if (data) {
      const { content, to, sender, senderid, chatName, isChannel } = data;
    
    console.log(socket.id, "just sent a message", data)

    if (isChannel) {
      const payload = {
        content,
        chatName,
        sender,
      };
      socket.to(to).emit('new message', payload);
    // Save the message to the database
    // const channel = await this.channelService.findOne(to);
    // const userchans = this.userService.getChannels();

    //TO DO BEFORE: A ADD DANS LE USER APRES CREATION ET CHECK DANS CHANNEL DATABASE
    // const channel = await this.userService.findOneChannelByName(senderid, chatName); //pour eviter doublon mp/private etc
    // if (channel) {
    //   const messageDto: CreateMessageDto = {
    //     content,
    //     sender,
    //     channel,
    //   };
    //   await this.messageService.create(messageDto);
    // }
    } else {
      const payload = {
        content,
        chatName: sender,
        sender,
      };
      socket.to(to).emit('new message', payload);
      // Save the message to the database
      // const channel = await this.channelService.findOne(to);
      // if (channel) {
        // const messageDto: CreateMessageDto = {
        //   content,
        //   sender,
        //   channel,
        // };
        // await this.messageService.create(messageDto);
        // await this.messageRepository.save(message);

      // }
    }
    if (this.messages[chatName]) {
      this.messages[chatName].push({
        sender,
        content,
      });
    }
  } else {
    console.log('Data parameter is undefined');
  }
  }
  
}
