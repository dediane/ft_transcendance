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
import { Puck } from 'src/game/puck';
import  Paddle  from 'src/game/paddle'

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
  // socket.userid = userdata.id;
  // socket.username = userdata.name;
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
      const accessType = channel.accessType;
    // const user = await this.userService.findOnebyId(userdata.id);

      // const user = await this.userService.findOneByName(userdata.name);
      // const blockedUsers = user.blockedUsers;
      // const blockedUsers = user.getBlockedUsers();
      // const blockedUsers =  await this.userService.findBlockedUsers(userdata.id);
      //A TESTER


      const blockedUsers =  await this.userService.getBlockedUsers(userdata.id);
      const channelMessages = await this.channelService.findMessagesByChatname(channelName, blockedUsers);

      // const channelMessages = await this.channelService.findMessagesByChatname(channelName);
      // const channelMessages = await this.channelService.findMessagesByChatname(channelName, userdata.id);
      const members = channel.members?.map(user => user.username);
      const admins = channel.admins?.map(user => user.username);
      socket.join(channelName);
      if (!this.messages[channelName]) {
        this.messages[channelName] = []; // add new room if it doesn't exist
      }
      console.log(
        socket.id,
        'just joined rooOOOOm',
        channelName, 'access type:',
        accessType,
        channelMessages,
      );
      this.messages[channelName].push(...channelMessages);
      console.log("members and admins AAAAAAARE", admins, members)
      console.log("THIS MESSAGES AFTER!!!!!! for ", channelName, this.messages[channelName]);
      this.server.emit('join room', { room: channelName, accessType: accessType, messages: channelMessages, members: members, admins: admins }); // send all messages for all rooms
    }
  }
}


  @SubscribeMessage('create chan')
  async handleCreateNewChan(socket: Socket, datachan: any) {
    const { creator, roomName, accessType, password } = datachan;
    if (roomName == null) { // check if roomName is null or undefined
      socket.emit('error', 'Room name cannot be null or undefined.'); // emit an error message to the socket
      return;
    }
    console.log(`attempting (${roomName}) room (${accessType}) creation. password is (${password}) and creator is (${datachan.creator})`)
    const usr = await this.userService.findOnebyId(datachan.creator);
    const existingChannel = await this.channelService.findOneByName(roomName);
    if (!existingChannel) {
      console.log(`room (${roomName})  doesn't exist so let's create it`)
      const channelDto: CreateChannelDto = {
        name: roomName,
        owner: usr,
        accessType: accessType,
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
  const updateChannelDto: UpdateChannelDto = {password: newPassword, name: channelName };

 await this.channelService.changeChannelPassword(userId, updateChannelDto);

}

@SubscribeMessage('remove password')
async handleRemoveChatPassword(socket: Socket, data: any) {

const { userId, channelName } = data;

await this.channelService.removeChannelPassword(userId, channelName);

}


@SubscribeMessage('check password')
async handlecheckChatPassword(socket: Socket, data: any) {
  const { userId, channelName, userInput } = data;
  // const updateChannelDto: UpdateChannelDto = { password: newPassword, name: channelName };

  const bool = await this.channelService.isChannelPasswordCorrect(channelName, userInput);
  console.log("channel pass is correct or not : ", bool);
  this.server.emit('is userinput correct', bool);
  

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

@SubscribeMessage('block user')
async handleBlockUser(socket: Socket, payload: any) {
  console.log("socket block user")
  const { UserWhoCantAnymore, usernameToBlock } = payload;

    console.log(UserWhoCantAnymore, usernameToBlock)
  await this.userService.blockUser(UserWhoCantAnymore, usernameToBlock);
}

@SubscribeMessage('unblock user')
async handleUnblockUser(socket: Socket, payload: any) {
  console.log("socket unblock user")
  const { UserWhoCantAnymore, usernameToBlock } = payload;

    console.log(UserWhoCantAnymore, usernameToBlock)
  await this.userService.unblockUser(UserWhoCantAnymore, usernameToBlock);
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

  // remove user
  @SubscribeMessage('remove user')
  async RemoveUser(socket: Socket, userid :number)
  {
    console.log("receive from back userid")
    await this.userService.remove(userid);
  }

  /////////////// GAME SIDE ///////////////

    room: string;
    isGameStart = false;
    width: number;
    height: number;
    puck: Puck;
    paddle_left : Paddle;
    paddle_right : Paddle;
    score = {
      left: 0,
      right: 0,
    }


  @SubscribeMessage("join_game")
    public async joinGame( 
          socket: Socket,
          data : any)
          // message: string) 
          {
            const {message, userid, username} = data;
            console.log("user id is ", userid, " username", username);
            console.log("room message id: ", message);
            this.room = message;
            const connectedSockets = this.server.sockets.adapter.rooms.get(message);
            //this.server.emit('game');

            const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
            if ( socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2))
            {
              socket.emit("room_join_error", {
                error: "Room is full please choose another room to play! you gonna be a spectator",
              });
            } else {
              await socket.join(message);
              this.server.emit("room_joined");
              console.log("ici in size == 2")
              
              if (this.server.sockets.adapter.rooms.get(message).size === 2) 
              { // si on a deux user start game 
                this.server.to(message).emit("start_game", {});
                // ici envoyer au front end change page in homegame et lancer le jeu
              }
            }
          }
          
          
          @SubscribeMessage('start game')
          async handleJoinnServer(socket: Socket, gamedata : any) {
            
            console.log('launch ball, ', this.room);
            this.width = gamedata.width;
            this.height = gamedata.height;
            console.log('width and height in backend haha ', this.width, this.height)
            this.puck = new Puck(this.width, this.height);
            console.log("deux users pour launch ball, puck instancier ");
            await socket.join(this.room);
            if (this.server.sockets.adapter.rooms.get(this.room).size === 2) 
            { // si on a deux user start game 
              this.isGameStart = true;
              console.log("game start true");
              this.updateBall(socket);
              //this.server.to(room).emit("launch ball", {}); // ici envoyer au front end change page in homegame et lancer le jeu
            }
            else
              console.log("no game started, size ", this.server.sockets.adapter.rooms.get(this.room).size)
            //this.server.emit('update ball');
          }
    

      // function helper to game position

      updateBall(socket: Socket) {
        //console.log("do something, I am a loop, in 1000 miliseconds, ill be run again");
        if (!this.isGameStart || this.puck.getx() > this.puck.getwidth()) {
          return;
        } else {
          if (this.puck) { // Check if this.puck is defined
            this.puck.update();
            const payload = {x : this.puck.x, y : this.puck.y }
            console.log("data of my puck, x and y: ", this.puck.getx(), this.puck.gety(), "New string senddddd");
            //this.server.to(this.room).emit("puck_update", {});
            this.server.to(this.room).emit("puck update", (payload));
          }
          setTimeout(this.updateBall.bind(this, socket), 10); // Bind the `this` context to the function
        }
      }

}
