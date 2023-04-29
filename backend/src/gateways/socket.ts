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
import { UpdateChannelDto } from 'src/channel/dto/update-channel.dto';
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
  }
    
  // RETRIEVE AND LOAD ALL MESSAGES IN ALL ROOMS FOR THIS USER

  const channels = await this.channelService.findAll();
  // const channels = await this.channelService.getChannelsforUser(userdata.id); //petits bugs a checker quand deux users differents se log et refresh la page
//aussi a GET LES PUBLIC CHANS 
  if (channels) {
  const channelNames = channels.map(channel => channel.name);
  console.log(channelNames);
  this.server.emit('all chans',channelNames);
  this.server.emit('connected users', this.users);
    for (const channel of channels) {
      const channelName = channel.name;
    const user = await this.userService.findOnebyId(userdata.id);

      // const user = await this.userService.findOneByName(userdata.name);
      const blockedUsers = user.blockedUsers;

      // const channelMessages = await this.channelService.findMessagesByChatname(channelName, blockedUsers);


      const channelMessages = await this.channelService.findMessagesByChatname(channelName);
      const members = channel.members?.map(user => user.username);
      const admins = channel.admins?.map(user => user.username);
      socket.join(channelName);
      if (!this.messages[channelName]) {
        this.messages[channelName] = []; // add new room if it doesn't exist
      }
      console.log(
        socket.id,
        'just joined rooOOOOm',
        channelName,
        channelMessages,
      );
      this.messages[channelName].push(...channelMessages);
      console.log("members and admins AAAAAAARE", admins, members)
      console.log("THIS MESSAGES AFTER!!!!!! for ", channelName, this.messages[channelName]);
      this.server.emit('join room', { room: channelName, messages: channelMessages, members: members, admins: admins }); // send all messages for all rooms
    }
  }
}


  @SubscribeMessage('create chan')
  async handleCreateNewChan(socket: Socket, datachan: any) {
    const { creator, roomName, password } = datachan;
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
        owner: usr,
        password: password,
        members: [usr],
        admins: [usr],
        // invitedUsers: [usr],
      };

    const newChannel = await this.channelService.createChannel(channelDto);
    this.server.emit('new chan', this.channelService.findAll()); // broadcast to all connected sockets
      
    }
  }

@SubscribeMessage('remove chan')
async handleRemoveChannel(socket: Socket, channelName: string) {

  console.log('removing channel', channelName)
  const existingChannel = await this.channelService.findOneByName(channelName);
  if (existingChannel) {
  console.log('existing channel', existingChannel.name, existingChannel.id)

    // await Promise.all(existingChannel.messages.map(async (msg) => {
    //   await this.messageService.remove(msg.id);
    // }));
    
    // await this.messageService.remove(existingChannel.messages.map(msg => msg.id)); // remove all messages in the channel
    await this.channelService.remove(existingChannel.id);
    this.server.emit('chan removed', channelName); // broadcast to all connected sockets
  } else {
    socket.emit('error', `Channel ${channelName} does not exist.`);
  }
}

@SubscribeMessage('change password')
async handleChatPassword(socket: Socket, data: any) {
  const { userId, channelName, newPassword } = data;
  const updateChannelDto: UpdateChannelDto = { password: newPassword, name: channelName };

  await this.channelService.changeChannelPassword(userId, updateChannelDto);
}

@SubscribeMessage('add member')
async handleAddMember(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.addMember(channelName, AdminId, username);
}


@SubscribeMessage('add admin')
async handleAddAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;
    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.addAdmin(channelName, AdminId, username);
}

@SubscribeMessage('remove admin')
async handleRemovAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeAdmin(channelName, AdminId, username);
}


@SubscribeMessage('remove member')
async handleRemoveMember(socket: Socket, payload: any) {
  console.log("socket remove member")
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeMember(channelName, AdminId, username);
}


@SubscribeMessage('ban member')
async handleBanMember(socket: Socket, payload: any) {
  console.log("socket remove member")
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.banMember(channelName, AdminId, username);
}

@SubscribeMessage('mute member')
async handleMuteMember(socket: Socket, payload: any) {
  console.log("socket mute member")
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.muteMember(channelName, AdminId, username);
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
    if (data) {
      const { content, to, sender, senderid, chatName, isChannel } = data;
    
    console.log(socket.id, "just sent a message", data)
      const payload = {
        content,
        chatName,
        sender: data.sender,
      };
      socket.to(to).emit('new message', payload);
    // Save the message to the database
    const channel = await this.channelService.findOneByName(to);
    // const userchans = this.userService.getChannels();  //plutot enregistrer dans le user chan pour eviter doublons ou bien par chanid
    const senderr = await this.userService.findOnebyId(senderid);
    //TO DO BEFORE: A ADD DANS LE USER APRES CREATION ET CHECK DANS CHANNEL DATABASE
    if (channel) {
      const messageDto: CreateMessageDto = {
        content,
        sender: senderr,
        channel,
      };
      await this.messageService.create(messageDto);
    }
    if (this.messages[chatName]) {
      this.messages[chatName].push({
        sender: data.sender,
        content,
      });
    }
  } else {
    console.log('Data parameter is undefined');
  }
  }
  
}
