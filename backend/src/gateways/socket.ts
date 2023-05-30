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
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { CreateChannelDto } from 'src/channel/dto/create-channel.dto';
import { UpdateChannelDto } from 'src/channel/dto/update-channel.dto';
import { Puck } from 'src/game/puck';
import  Paddle  from 'src/game/paddle';
import { GameService } from 'src/game/game.service';
import { CreateGameDto } from 'src/game/dto/create-game.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';
import { subscribeOn } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Jwt2faAuthGuard } from 'src/auth/guards/jwt-2fa.guard';

type GameProps = {
  id: number;
  userA: Socket;
  userB: Socket;
  scoreA: number;
  scoreB: number;
  idA: number;
  idB: number;
};

@WebSocketGateway({ cors: true })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly messageService: MessageService,
    private readonly channelService: ChannelService,
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  @WebSocketServer()
  server: Server;

  private users: any[] = [];
  private allusers: any[] = [];
  private messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: [],
  };
  private games = new Map<number, GameProps>(); // gameid, gameprops
  private queue = new Map<number, User>();  // userid, user
  private queueC = new Map<number, User>();  // userid, user
  private queueE = new Map<number, User>(); // userid, user
  private sockn = new Map<number, Socket[]>()
  private socknE = new Map<number, Socket[]>()
  private socknC = new Map<number, Socket[]>()
  private sock = new Map<number, Socket>(); // userid, socket
  private sockE = new Map<number, Socket>();// userid, socket
  private sockC = new Map<number, Socket>();// userid, socket
  private allUsers = new Map<string, boolean>();
  private  first = false;

 
  @SubscribeMessage('online')
async handleOnline(socket: Socket, username: string) {
  if (this.first == false)
  {
    const allUsers = await this.userService.findAll();

    for (const user of allUsers) {
      this.allUsers.set(user.username, false);
    }
    // console.log("this all users in online susc", this.allUsers)
    this.first = true;
  }
  this.allUsers.set(username, true);
}

@SubscribeMessage('offline')
async handleOffline(socket: Socket, username: string) {
  if (this.first == false)
  {
    const allUsers = await this.userService.findAll();

    for (const user of allUsers) {
      this.allUsers.set(user.username, false);
    }

    this.first = true;
  }
  this.allUsers.set(username, false);

}

@SubscribeMessage('isConnected')
async handleIsConnected(socket: Socket, username: string)
{
  const bool = this.allUsers.get(username);
  console.log(this.allUsers);
  console.log("user " + username + " is in isconnected " + bool)
  console.log("IS IT CONNECTED?? ->> ", bool)
  this.server.emit('isConnected', bool);

}

  async handleConnection(socket: Socket) {
    const users = await this.messageService.findAll();
    // this.gameService.deleteall();
    // this.userService.deleteall();
  }

 async handleDisconnect(socket: Socket) {
  if (this.isGameStart)
  {
    const user = this.getUserIdFromSocket(socket);
    if (user)
    {
      this.isGameStart = false;
      if (user == this.paddle_left.id)
      {
        this.puck.left_score = 0;
        this.puck.right_score = this.fscore
        this.user_left = true;
      }
      else if (user == this.paddle_right.id)
      {
        this.puck.right_score = 0;
        this.puck.left_score = this.fscore
        this.user_left = true;
      }
    }
  }
  if (this.isGameStartE)
  {
    const user = this.getByValue(this.sockE, socket);
    if (user)
    {
      this.isGameStartE = false;
      if (user == this.paddle_leftE.id)
      {
        this.puckE.left_score = 0;
        this.puckE.right_score = this.fscoreE
        this.user_leftE = true;
      }
      else if (user == this.paddle_rightE.id)
      {
        this.puckE.right_score = 0;
        this.puckE.left_score = this.fscoreE
        this.user_leftE = true;
      }
    }
  }
  if (this.isGameStartC)
  {
    const user = this.getUserIdFromSocket(socket);
    if (user)
    {
      this.isGameStartC = false;
      if (user == this.paddle_leftC.id)
      {
        this.puckC.left_score = 0;
        this.puckC.right_score = this.fscoreC
        this.user_leftC = true;
      }
      else if (user == this.paddle_rightC.id)
      {
        this.puckC.right_score = 0;
        this.puckC.left_score = this.fscore
        this.user_leftC = true;
      }
    }
  }
  const userIndex = this.users.findIndex((u) => u.sockets.includes(socket.id));
  if (userIndex >= 0) {
    this.users[userIndex].sockets = this.users[userIndex].sockets.filter((s) => s !== socket.id);
    if (this.users[userIndex].sockets.length === 0) {
      const disconnectedUser = this.users.splice(userIndex, 1)[0];
    }
  }
  this.server.emit('connected users', this.users);
  const userrIndex = this.allusers.findIndex((u) => u.sockets.includes(socket.id));
  if (userrIndex >= 0) {
    this.allusers[userrIndex].sockets = this.allusers[userrIndex].sockets.filter((s) => s !== socket.id);
    if (this.allusers[userrIndex].sockets.length === 0) {
      const disconnectedUser = this.allusers.splice(userrIndex, 1)[0];
    }
  }
  this.server.emit('connected all users', this.allusers);
}

@SubscribeMessage('all users')
async handleGetUsers(socket: Socket, userdata: {id: string, name: string}) {
  const currentuser = await this.userService.findOnebyId(Number(userdata.id));
  const allusers = await this.userService.findAll();
  const payload = {
    currentuser,
    allusers,
  };
  this.server.to(socket.id).emit('all users', payload);

}

// @SubscribeMessage('refresh')
// async handleRefresh(socket: Socket, userdataid: string}) {
// {
// await ;
// }


@SubscribeMessage('join server')
async handleJoinServer(socket: Socket, userdata: {id: string, username: string}) {
  if (userdata.id == '' || userdata.username == '')
    return;
  const userIndex = this.users.findIndex((u) => u.id === userdata.id);
  if (userIndex >= 0) {
    this.users[userIndex].sockets.push(socket.id);
  } else {
    const user = {
      username: userdata.username,
      id: userdata.id,
      sockets: [socket.id],
    };
    this.users.push(user);
  }
  const channels = await this.channelService.getChannelsforUser(Number(userdata.id)); //petits bugs a checker quand deux users differents se log et refresh la page

  if (channels) {
  const channelNames = channels.map(channel => channel.name);
  if (channelNames.length === 0) {
    this.server.to(socket.id).emit('join room', { channels: channels });
  }
   this.server.to(socket.id).emit('all chans',channelNames);
   this.server.emit('connected users', this.users);
   const payload = {users : this.users}
   this.server.emit('connected userss', payload);

    for (const channel of channels) {

      const channelName = channel.name;
      const accessType = channel.accessType;
      const blockedUsers =  await this.userService.getBlockedUsers(Number(userdata.id));
      const blockedusernames = blockedUsers?.map(user => user.username);
      const channelMessages = await this.channelService.findMessagesByChatname(channelName, blockedUsers);
      const members = channel.members?.map(user => user.username);
      const mutedMembers = channel.mutedMembers?.map(user => user.username);
      const admins = channel.admins?.map(user => user.username);
      const bannedmembers = channel.bannedUsers?.map(user => user.username);
      const owner = channel.owner.username;

      socket.join(channelName);
      if (!this.messages[channelName]) {
        this.messages[channelName] = []; 
      }
    
      this.messages[channelName].push(...channelMessages);
       this.server.to(socket.id).emit('join room', { room: channelName, accessType: accessType, messages: channelMessages, members: members, admins: admins, bannedmembers: bannedmembers, mutedMembers:mutedMembers, owner: owner, blockedUsers: blockedusernames, channels: channels }); // send all messages for all rooms
       this.server.to(socket.id).emit("all user's chans", channels);
    }
  }
}


  @SubscribeMessage('create chan')
  async handleCreateNewChan(socket: Socket, datachan: any) {
    const { creator, roomName, accessType, password } = datachan;
    if (roomName == null) { 
      socket.emit('error', 'Room name cannot be null or undefined.');
      return;
    }
    const usr = await this.userService.findOnebyId(datachan.creator);
    const existingChannel = await this.channelService.findOneByName(roomName);
    
    if (!existingChannel) {
      const channelDto: CreateChannelDto = {
        name: roomName,
        owner: usr,
        accessType: accessType,
        password: password,
        members: [usr],
        admins: [usr],
      };

    const newChannel = await this.channelService.createChannel(channelDto);
    const channels = await this.channelService.findAll()
     this.server.emit('new chan', channels ); // broadcast to all connected sockets
    }
  }


  @SubscribeMessage('create DM')
  async handleCreateDM(socket: Socket, datachan: any) {
    const { username1, username2 } = datachan;
 
    const newChannel = await this.channelService.createDm(username1, username2);

     const channels = await this.channelService.findAll()
     this.server.emit('new chan', channels );
    }
  

@SubscribeMessage('remove chan')
async handleRemoveChannel(socket: Socket, channelName: string) {

  const existingChannel = await this.channelService.findOneByName(channelName);
  if (existingChannel) {
    await this.channelService.remove(existingChannel.id);
    const channels = await this.channelService.findAll()
    this.server.emit('new chan', channels );
  } 
}

@SubscribeMessage('change password')
async handleChatPassword(socket: Socket, data: any) {
  const { userId, channelName, newPassword } = data;
  const updateChannelDto: UpdateChannelDto = {password: newPassword, name: channelName };

 await this.channelService.changeChannelPassword(userId, updateChannelDto);
 const channels = await this.channelService.findAll()
 this.server.emit('new chan', channels );

}

@SubscribeMessage('remove password')
async handleRemoveChatPassword(socket: Socket, data: any) {

const { userId, channelName } = data;

await this.channelService.removeChannelPassword(userId, channelName);
const channels = await this.channelService.findAll()
this.server.emit('new chan', channels );

}

@SubscribeMessage('add member')
async handleAddMember(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

  const chan = await this.channelService.findOneByName(channelName);
  const bool = await this.channelService.addMember(channelName, AdminId, username);
  this.server.emit("member adding", {memberadded: bool, username: username})
  const channels = await this.channelService.findAll()
  this.server.emit('new chan', channels );
}


@SubscribeMessage('add admin')
async handleAddAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.addAdmin(channelName, AdminId, username);
 const channels = await this.channelService.findAll()
 this.server.emit('new chan', channels );
}

@SubscribeMessage('remove admin')
async handleRemovAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeAdmin(channelName, AdminId, username);
 const channels = await this.channelService.findAll()
 this.server.emit('new chan', channels );
}


@SubscribeMessage('remove member')
async handleRemoveMember(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeMember(channelName, AdminId, username);
  const channels = await this.channelService.findAll()
  this.server.emit('new chan', channels );
}

@SubscribeMessage('block user')
async handleBlockUser(socket: Socket, payload: any) {
  const { UserWhoCantAnymore, usernameToBlock } = payload;

  await this.userService.blockUser(UserWhoCantAnymore, usernameToBlock);
}

@SubscribeMessage('unblock user')
async handleUnblockUser(socket: Socket, payload: any) {
  const { UserWhoCantAnymore, usernameToBlock } = payload;

  await this.userService.unblockUser(UserWhoCantAnymore, usernameToBlock);
}



@SubscribeMessage('ban member')
async handleBanMember(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.banMember(channelName, AdminId, username);
  const channels = await this.channelService.findAll()
  this.server.emit('new chan', channels );
}

@SubscribeMessage('mute member')
async handleMuteMember(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.muteMember(channelName, AdminId, username);
}

  @SubscribeMessage('join room')
  async handleJoinRoom(socket: Socket, roomName: string) {
    socket.join(roomName);
    if (!this.messages[roomName]) {
      this.messages[roomName] = []; 
    }
    socket.emit('join room', this.messages[roomName]);
  }


  @SubscribeMessage('sendInvitation')
  async handlePongInvite(socket: Socket, data : any) {

    const { sender , receiver, chatName} = data;

    const senderr = await this.userService.findOneByName(sender);
    const receiverr = await this.userService.findOneByName(receiver);
    const receiverUser = this.users.find(user => user.username === receiverr.username);

    if (receiverUser) {
      const receiverSockets = receiverUser.sockets;
      receiverSockets.forEach(receiverSocket => {
        this.server.to(receiverSocket).emit('receiveInvitation', { sender: senderr, receiver : receiver, chatName : chatName});
      });
    } 
  }

  @SubscribeMessage('send message')
  async handleMessage(socket: Socket, data: any) {
    if (data) {
      const { content, to, sender, senderid, chatName, isChannel } = data;
      const payload = {
        content,
        chatName,
        sender: data.sender,
      };
    const channel = await this.channelService.findOneByName(to);
    const mutedMember = channel.mutedMembers.find(member => member.id === senderid);

    if (mutedMember) {
      const payload = {
        content: 'You have been muted in this channel for one minute. (The messages you are currently sending will not be received by other users.)',
        chatName,
        sender: 'System',
      };

      socket.emit('new message', payload);
      return; 
    }
    const senderr = await this.userService.findOnebyId(senderid);
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
const excludedSocketIds = [];

for (const user of this.users) {

  const blockedUsers = await this.userService.getBlockedUsers(user.id);
  const excludedUserIds = blockedUsers.map(user => user.id);

  if (excludedUserIds.includes(senderid)) {
    excludedSocketIds.push(...user.sockets);
  }
}
      socket.to(to).except(excludedSocketIds).emit('new message', payload);
  }
  }
  
  /////////////// GAME SIDE ///////////////

  room_id: string;
  isGameStart = false;
  width: number;
  height: number;
  puck: Puck;
  paddle_left : Paddle;
  paddle_right : Paddle;
  fscore = 5;
  player1: User;
  player2: User;
  speed = 1;
  time = 25;
  user_left = false;
  user_leftE = false;
  user_leftC = false;
  // data i use for the logistic


    // join classic game from home page
@SubscribeMessage("join_game")
  public async joinGame( 
        socket: Socket,
        data : any) 
    {
      const {message, userid, username} = data;
      if (!this.room_id || this.room_id == "")
      {
        const gameDto: CreateGameDto = {
          score1 : 0,
          score2 : 0,
        };
        const game = await this.gameService.create(gameDto);
        if (!game)
          return ;
        this.room_id = game.id.toString();
      } // generate the data id
      const user = await this.userService.findOnebyId(userid);
      if (this.queue.size == 0)
        this.queue.set(userid, user);
      else
      {
        const usr = this.queue.get(userid);
        if (usr)
        {
          socket.emit("room_join_error", {
            error: "You canno't join with 2 tab!",
          });
          return ;
        }
        else
          this.queue.set(userid, user) // add a new user not same as the first
      }
      if (this.queue.size == 2)
      {
        const it = this.queue.entries();
        const usr1 = it.next().value[1];
        const usr2 = it.next().value[1];
        this.player1 = usr1;
        this.player2 = usr2;
      }
      const connectedSockets = this.server.sockets.adapter.rooms.get(this.room_id);
      const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
      if ( socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2))
      { // already 2 people in the room
        socket.emit("room_join_error", {
          error: "Room is full please wait the game end to play!",
        });
      } else {
        await socket.join(this.room_id);
        this.server.emit("room_joined");
        // send that a person join the room
        if (this.server.sockets.adapter.rooms.get(this.room_id)?.size === 2) 
        { // we have 2 people so start game
          this.queue.delete(this.player1?.id);
          this.queue.delete(this.player2?.id);
          this.server.to(this.room_id).emit("start_game", {});
        }
      }
    }
        
        // start game from pong.txt 
        @SubscribeMessage('start game')
        async handleJoinGameServer( socket: Socket, gamedata : any) {
          // this have to be change for the responssive
          // and set the width and height to 500 / 500
          // this.width = 500;
          // this.height = 500;
          this.width = 1000;
          this.height = 1000;
          this.puck = new Puck(this.width, this.height, false);
          if (!this.paddle_left)
          {
            this.paddle_left = new Paddle(this.width, this.height, true, false, this.player1?.id, this.player1?.username)
            this.sock.set(this.player1?.id, socket);
            const socketArray = this.sockn.get(gamedata.id);
            
            if (socketArray) {
              // Socket array already exists, so push the new socket into it
              socketArray.push(socket);
            } else {
              // Socket array doesn't exist, create a new array with the new socket and set it in the Map
              const newSocketArray: Socket[] = [socket];
              this.sockn.set(gamedata.id, newSocketArray);
            }
          }
          else
          {
            this.paddle_right = new Paddle(this.width, this.height, false, false, this.player2?.id, this.player2?.username)
            this.sock.set(this.player2?.id, socket);
            const socketArray = this.sockn.get(gamedata.id);
            
            if (socketArray) {
              // Socket array already exists, so push the new socket into it
              socketArray.push(socket);
            } else {
              // Socket array doesn't exist, create a new array with the new socket and set it in the Map
              const newSocketArray: Socket[] = [socket];
              this.sockn.set(gamedata.id, newSocketArray);
            }
          }
          await socket.join(this.room_id);
          if (this.server.sockets.adapter.rooms.get(this.room_id)?.size == 2 && this.isGameStart == false) 
            { // si on a deux user start game 
              this.isGameStart = true;
              this.updateBall();
            }
          }
  

        @SubscribeMessage('KeyReleased')
        async KeyRealaesed(socket: Socket) {
          this.paddle_left.move(0);
          this.paddle_right.move(0);
        }

        @SubscribeMessage('KeyPressed')
        async KeyPressedr(socket: Socket, gamedata : any) { 
          if (gamedata.id == this.paddle_left.id)
          {
            if (gamedata.key == 'w')
            {
              this.paddle_left.move(-20);
            }
            if (gamedata.key == 's')
            {
              this.paddle_left.move(20);
            }
          }
          else if (gamedata.id == this.paddle_right.id)
          {
            if (gamedata.key == 'w')
            {
                this.paddle_right.move(-20);
            }
            else if (gamedata.key == 's')
            {
                this.paddle_right.move(20);
          }
          }
        }

        async addscore(id_room: string) {
          this.isGameStart = false;
          this.sock.delete(this.paddle_left.id);
          this.sock.delete(this.paddle_right.id);
          this.sockn.delete(this.paddle_left.id);
          this.sockn.delete(this.paddle_right.id);
          const luser = await this.userService.findOnebyId2(this.paddle_left.id)
          const ruser = await this.userService.findOnebyId2(this.paddle_right.id)
          if (this.puck.left_score == this.fscore)
          {
            luser.wins += 1;
            ruser.losses += 1;
          }
          else if (this.puck.right_score == this.fscore)
          {
            luser.losses += 1;
            ruser.wins += 1;
          }
          await this.userService.update(this.paddle_left.id, luser);
          await this.userService.update(this.paddle_right.id, ruser);

          const upgame = await this.gameService.findOne(Number(id_room))
          upgame.player1 = luser;
          upgame.player2 = ruser;
          upgame.score1 = this.puck.left_score;
          upgame.score2 = this.puck.right_score;
          await this.gameService.update(Number(id_room), upgame);
          if (this.user_left)
          this.server.to(id_room).emit("user left");
          setTimeout(this.end_game.bind(this, id_room),  5 * 1000)
        }
        
        end_game(id_room: string) {
          let payload : {status: boolean, username1: string, username2: string}
          this.room_id = "";
          if (this.paddle_left && this.paddle_right)
          {
            payload = {status: false, username1 : this.paddle_left.name, username2: this.paddle_right.name}
            this.server.emit("user_status", payload);
            this.paddle_left.cleanup();
            this.paddle_right.cleanup();
          }
          this.paddle_left = undefined;
          this.paddle_right = undefined;
          this.user_left = false;
          this.room_idE = "";
          if (this.paddle_leftE && this.paddle_rightE)
          {
            payload = {status: false, username1 : this.paddle_leftE.name, username2: this.paddle_rightE.name}
            this.server.emit("user_status", payload);
            this.paddle_leftE.cleanup();
            this.paddle_rightE.cleanup();
          }
          this.paddle_leftE = undefined;
          this.paddle_rightE = undefined;
          this.user_leftE = false;
          this.room_idC = "";
          if (this.paddle_leftC && this.paddle_rightC)
          {
            payload = {status: false, username1 : this.paddle_leftC.name, username2: this.paddle_rightC.name}
            this.server.emit("user_status", payload);
            this.paddle_leftC.cleanup();
            this.paddle_rightC.cleanup();
          }
          this.paddle_leftC = undefined;
          this.paddle_rightC = undefined;
          this.user_leftC = false;
          this.gameService.deleteempty();
          this.server.to(id_room).emit("end game");
        }
        @SubscribeMessage('refresh')
        handlerefresh(socket: Socket, id : string){
          const userid = Number(id);
          if (this.queue)
          {
            const usr = this.queue.get(userid);
            if (usr)
              this.queue.delete(userid);
          }
          if (this.queueE)
          {
            const usr = this.queueE.get(userid);
            if (usr)
              this.queueE.delete(userid);
          }
          if (this.queueC) // haha
          {
            const usr = this.queueC.get(userid);
            if (usr)
              this.queueC.delete(userid);
          }
        }

        @SubscribeMessage('change page')
        handlechange(socket: Socket, payload: any){
          const userid = Number(payload.id);
          if (payload.game == "classic")
          {
            this.isGameStart = false;
            if (userid == this.paddle_left.id)
            {
              this.puck.left_score = 0;
              this.puck.right_score = this.fscore
              this.user_left = true;
            }
            else if (userid == this.paddle_right.id)
            {
              this.puck.right_score = 0;
              this.puck.left_score = this.fscore
              this.user_left = true;
            }
          }
          if (payload.game == "extra")
          {
            const usr = this.queueE.get(userid);
            this.isGameStartE = false;
            if (userid == this.paddle_leftE.id)
            {
              this.puckE.left_score = 0;
              this.puckE.right_score = this.fscoreE
              this.user_leftE = true;
            }
            else if (userid == this.paddle_rightE.id)
            {
              this.puckE.right_score = 0;
              this.puckE.left_score = this.fscoreE
              this.user_leftE = true;
            }
          }
          if (payload.game == "chat") // haha
          {
            this.isGameStartC= false;
            if (userid == this.paddle_leftC.id)
            {
              this.puckC.left_score = 0;
              this.puckC.right_score = this.fscoreE
              this.user_leftC = true;
            }
            else if (userid == this.paddle_rightC.id)
            {
              this.puckC.right_score = 0;
              this.puckC.left_score = this.fscoreE
              this.user_leftC = true;
            }
          }
        }
        // function helper to game position
    updateBall() {
      if (!this.isGameStart || this.puck.left_score == this.fscore || this.puck.right_score == this.fscore) {
        this.addscore(this.room_id);
        return;
      }
      else {
        if (this.puck) { // Check if this.puck is defined
          this.puck.update();
          this.puck.edges();
          this.puck.checkPaddleLeft(this.paddle_left);
          this.puck.checkPaddleRight(this.paddle_right);
          const payload = {x : this.puck.x, y : this.puck.y, lscore: this.puck.left_score, rscore: this.puck.right_score}
          if (this.paddle_left && this.paddle_right)
          {
            const payload = {status: true, username1 : this.paddle_left.name, username2: this.paddle_right.name}
            this.server.emit("user_status", payload);
            this.paddle_left.update();
            this.paddle_right.update()
            const payloadp = {prx: this.paddle_right.x, pry: this.paddle_right.y, prw: this.paddle_right.w, prh: this.paddle_right.h, pln: this.paddle_left.name, plx: this.paddle_left.x, ply: this.paddle_left.y, plw: this.paddle_left.w, plh: this.paddle_left.h, prn: this.paddle_right.name}
            this.server.to(this.room_id).emit("paddle update", (payloadp));
          };
          this.server.to(this.room_id).emit("puck update", (payload));
        }
        setTimeout(this.updateBall.bind(this), this.time); // Bind the `this` context to the function
      }
    }

    
    // helper
    getByValue(map : Map<number, Socket>, searchValue: Socket) {
      for (let [key, value] of map.entries()) {
        if (value === searchValue)
          return key;
      }
    }

    // Function to get the userId from a given socket
    getUserIdFromSocket(socket) {
      for (const [userId, socketArray] of this.sockn.entries()) {
        // Check if the socket is present in the socket array
        if (socketArray.includes(socket)) {
          return userId; // Found the matching socket, return the userId
        }
      }
      return null; // Socket not found
    }
    ///////////////////////: Extra Game /////////////////////
    room_idE: string;
    isGameStartE = false;
    widthE: number;
    heightE: number;
    puckE: Puck;
    paddle_leftE : Paddle;
    paddle_rightE : Paddle;
    fscoreE = 5;
    player1E: User;
    player2E: User;
    speedE = 1;
    timeE = 25;
    plreadyE = 0;

    // helper
    ///////////////////////: Extra Game /////////////////////
    // join game extra from home_game
    @SubscribeMessage("join_game_extra")
    public async joinExtraGame( 
      socket: Socket,
      data : any)
      {
        const {message, userid, username} = data;
      if (!this.room_idE)
      {
        const gameDto: CreateGameDto = {
          score1 : 0,
          score2 : 0,
        };
        const game = await this.gameService.create(gameDto);
        if (!game)
          return ;
        this.room_idE = game.id.toString();
      } // generate id game
      const user = await this.userService.findOnebyId(userid)
      if (this.queueE.size == 0)
        this.queueE.set(userid, user)
      else
      {
        const usr = this.queueE.get(userid);
        if (usr)
        {
          socket.emit("room_join_error", {
            error: "You canno't join with 2 tab!",
          });
          return ;
        }
        else
          this.queueE.set(userid, user) // add a new user not same as the first
      }
      if (this.queueE.size == 2)
      {
        const it = this.queueE.entries();
        const usr1 = it.next().value[1];
        const usr2 = it.next().value[1];
        this.player1E = usr1;
        this.player2E = usr2;
      }
      const connectedSockets = this.server.sockets.adapter.rooms.get(this.room_idE);
      const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
      if ( socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2))
      { // already 2 people in the room
        socket.emit("room_join_error", {
          error: "Room is full please wait the game end to play!",
        });
      } else {
        await socket.join(this.room_idE);
        this.server.emit("room_joined");
        
        if (this.server.sockets.adapter.rooms.get(this.room_idE)?.size === 2) 
        { // we have 2 people to play
          this.queueE.delete(this.player1E.id);
          this.queueE.delete(this.player2E.id);
          this.server.to(this.room_idE).emit("start_game_extra", {});
        }
      }
    }

    @SubscribeMessage('start game extra')
    async handleJoinGameServerExtra(socket: Socket, gamedata : any) {
      // this have to be change for the responssive
      // and set the width and height to 500 / 500
      this.heightE = 1000;
      this.widthE = 1000;
      this.puckE = new Puck(this.widthE, this.heightE, true);
      if (!this.paddle_leftE)
      {
        this.paddle_leftE = new Paddle(this.widthE, this.heightE, true, true, this.player1E.id, this.player1E.username)
        this.sockE.set(this.player1E.id, socket);
        const socketArray = this.socknE.get(gamedata.id);
        
        if (socketArray) {
          // Socket array already exists, so push the new socket into it
          socketArray.push(socket);
        } else {
          // Socket array doesn't exist, create a new array with the new socket and set it in the Map
          const newSocketArray: Socket[] = [socket];
          this.socknE.set(gamedata.id, newSocketArray);
        }
      }
      else
      {
        this.paddle_rightE = new Paddle(this.widthE, this.heightE, false, true, this.player2E.id, this.player2E.username)
        this.sockE.set(this.player2E.id, socket);
        const socketArray = this.socknE.get(gamedata.id);
        
        if (socketArray) {
          // Socket array already exists, so push the new socket into it
          socketArray.push(socket);
        } else {
          // Socket array doesn't exist, create a new array with the new socket and set it in the Map
          const newSocketArray: Socket[] = [socket];
          this.socknE.set(gamedata.id, newSocketArray);
        }
      }
      await socket.join(this.room_idE);
      if (this.server.sockets.adapter.rooms.get(this.room_idE)?.size === 2 && this.isGameStartE == false) 
      { // si on a deux user start game 
        this.isGameStartE = true;
        this.updateBallExtra();
      }
    }

    updateBallExtra() {
      if (!this.isGameStartE || this.puckE.left_score == this.fscoreE || this.puckE.right_score == this.fscoreE) {
        this.addscoreE(this.room_idE);
        // socket emit
        return;
      }
      else {
        if (this.puckE) { // Check if this.puck is defined
          this.puckE.update();
          this.speedE = this.puckE.edges();
          this.speedE = this.puckE.checkPaddleLeft(this.paddle_leftE);
          this.speedE = this.puckE.checkPaddleRight(this.paddle_rightE);
          const payload = {x : this.puckE.x, y : this.puckE.y, lscore: this.puckE.left_score, rscore: this.puckE.right_score}
          if (this.paddle_leftE && this.paddle_rightE)
          {
            const payload = {status: true, username1 : this.paddle_leftE.name, username2: this.paddle_rightE.name}
            this.server.emit("user_status", payload);
            this.paddle_leftE.update();
            this.paddle_rightE.update();
            const payloadp = {prx: this.paddle_rightE.x, pry: this.paddle_rightE.y, prw: this.paddle_rightE.w, prh: this.paddle_rightE.h, pln: this.paddle_leftE.name, plx: this.paddle_leftE.x, ply: this.paddle_leftE.y, plw: this.paddle_leftE.w, plh: this.paddle_leftE.h, prn: this.paddle_rightE.name}
            this.server.to(this.room_idE).emit("paddle update", (payloadp));
          };
          this.server.to(this.room_idE).emit("puck update", (payload));
        }
        setTimeout(this.updateBallExtra.bind(this), this.timeE); // Bind the `this` context to the function
      }
    }

    @SubscribeMessage('KeyPressed extra')
    async KeyPressed(socket: Socket, gamedata : any) { 
      if (gamedata.id == this.paddle_leftE.id)
      {
        if (gamedata.key == 'w')
        {
          this.paddle_leftE.move(-20 * this.speedE);
        }
        if (gamedata.key == 's')
        {
          this.paddle_leftE.move(20 * this.speedE);
        }
      }
      else if (gamedata.id == this.paddle_rightE.id)
      {
        if (gamedata.key == 'w')
        {
            this.paddle_rightE.move(-20 * this.speedE);
        }
        else if (gamedata.key == 's')
        {
            this.paddle_rightE.move(20 * this.speedE);
      }
      }
    }
    @SubscribeMessage('KeyReleasedExtra')
    async KeyRealaesedExtra(socket: Socket) {
      this.paddle_leftE.move(0);
      this.paddle_rightE.move(0);
    }
    async addscoreE(id_room: string) {
      this.isGameStartE = false;
      this.sockE.delete(this.paddle_leftE.id);
      this.sockE.delete(this.paddle_rightE.id);
      this.socknE.delete(this.paddle_leftE.id);
      this.socknE.delete(this.paddle_rightE.id);
      const luser = await this.userService.findOnebyId2(this.paddle_leftE.id)
      const ruser = await this.userService.findOnebyId2(this.paddle_rightE.id)
      if (this.puckE.left_score == this.fscoreE)
      {              
        luser.wins += 1;
        ruser.losses += 1;
      }
      else if (this.puckE.right_score ==this.fscoreE)
      {
        luser.losses += 1;
        ruser.wins += 1;
      }
      await this.userService.update(this.paddle_leftE.id, luser);
      await this.userService.update(this.paddle_rightE.id, ruser);

      const upgame = await this.gameService.findOne(Number(id_room))
      upgame.player1 = luser;
      upgame.player2 = ruser;
      upgame.score1 = this.puckE.left_score;
      upgame.score2 = this.puckE.right_score;
      await this.gameService.update(Number(id_room), upgame);
      if (this.user_leftE)
        this.server.to(id_room).emit("user left extra");
      setTimeout(this.end_game.bind(this, id_room),  5 * 1000)
    }

    //////////////////////////////: Chat Pong Game

    room_idC: string;
    isGameStartC = false;
    widthC: number;
    heightC: number;
    puckC: Puck;
    paddle_leftC : Paddle;
    paddle_rightC : Paddle;
    fscoreC = 5;
    player1C: User;
    player2C: User;
    speedC = 1;
    timeC = 25;

    @SubscribeMessage("join_game chat")
    public async joinGamechat( 
        socket: Socket,
        data : any) 
    {
      // const {userid, username} = data;
      const userid = Number(data.userid);
      const username = data.username;
      if (!this.room_idC || this.room_idC == "")
      {
        const gameDto: CreateGameDto = {
          score1 : 0,
          score2 : 0,
        };
        const game = await this.gameService.create(gameDto);
        if (!game)
          return ;
        this.room_idC = game.id.toString();
      } // generate the data id
      const user = await this.userService.findOnebyId(userid);
      if (this.queueC.size == 0)
      {
        this.queueC.set(userid, user);
      }
      else
      {
        const usr = this.queueC.get(userid);
        if (usr)
        {
          return ;
        }
        else
          this.queueC.set(userid, user) // add a new user not same as the first
      }
      if (this.queueC.size == 2)
      {
        const it = this.queueC.entries();
        const usr1 = it.next().value[1];
        const usr2 = it.next().value[1];
        this.player1C = usr1;
        this.player2C = usr2;
      }
      const connectedSockets = this.server.sockets.adapter.rooms.get(this.room_idC);
      const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
      if ( socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2))
      { 
        // already 2 people in the room 
      } else {
        await socket.join(this.room_idC);
        this.server.emit("room_joined chat");
        // send that a person join the room
        if (this.server.sockets.adapter.rooms.get(this.room_idC)?.size === 2) 
        { // we have 2 people so start game
          this.queueC.delete(this.player1C.id);
          this.queueC.delete(this.player2C.id);
          this.server.to(this.room_idC).emit("start_game chat", {});
        }
      }
    }
        
        // start game from pong.txt 
        @SubscribeMessage('start game chat')
        async handleJoinGameServerFromChat( socket: Socket, gamedata : any) {

          this.widthC = 1000;
          this.heightC = 1000;
          this.puckC = new Puck(this.widthC, this.heightC, false);
          if (!this.paddle_leftC)
          {
            this.paddle_leftC = new Paddle(this.widthC, this.heightC, true, false, Number(this.player1C.id), this.player1C.username)
            this.sockC.set(this.player1C.id, socket);
            const socketArray = this.socknC.get(gamedata.id);
            
            if (socketArray) {
              // Socket array already exists, so push the new socket into it
              socketArray.push(socket);
            } else {
              // Socket array doesn't exist, create a new array with the new socket and set it in the Map
              const newSocketArray: Socket[] = [socket];
              this.sockn.set(gamedata.id, newSocketArray);
            }
          }
          else
          {
            this.paddle_rightC = new Paddle(this.widthC, this.heightC, false, false, this.player2C.id, this.player2C.username)
            this.sock.set(this.player2C.id, socket);
            const socketArray = this.socknC.get(gamedata.id);
            
            if (socketArray) {
              // Socket array already exists, so push the new socket into it
              socketArray.push(socket);
            } else {
              // Socket array doesn't exist, create a new array with the new socket and set it in the Map
              const newSocketArray: Socket[] = [socket];
              this.sockn.set(gamedata.id, newSocketArray);
            }
          }
          await socket.join(this.room_idC);
          if (this.server.sockets.adapter.rooms.get(this.room_idC)?.size == 2 && this.isGameStartC == false) 
            { // si on a deux user start game 
              this.isGameStartC = true;
              this.updateBallChat();
            }
          }

                  // function helper to game position
    updateBallChat() {
      if (!this.isGameStartC || this.puckC.left_score == this.fscoreC || this.puckC.right_score == this.fscoreC) {
        this.addscoreC(this.room_idC);
        return;
      }
      else {
        if (this.puckC) { // Check if this.puck is defined
          this.puckC.update();
          this.puckC.edges();
          this.puckC.checkPaddleLeft(this.paddle_leftC);
          this.puckC.checkPaddleRight(this.paddle_rightC);
          const payload = {x : this.puckC.x, y : this.puckC.y, lscoreC: this.puckC.left_score, rscoreC: this.puckC.right_score}
          if (this.paddle_leftC && this.paddle_rightC)
          {
            const payload = {status: true, username1 : this.paddle_leftC.name, username2: this.paddle_rightC.name}
            this.server.emit("user_status", payload);
            this.paddle_leftC.update();
            this.paddle_rightC.update()
            const payloadp = {prx: this.paddle_rightC.x, pry: this.paddle_rightC.y, prw: this.paddle_rightC.w, prh: this.paddle_rightC.h, pln: this.paddle_leftC.name, plx: this.paddle_leftC.x, ply: this.paddle_leftC.y, plw: this.paddle_leftC.w, plh: this.paddle_leftC.h, prn: this.paddle_rightC.name}
            this.server.to(this.room_idC).emit("paddle update chat", (payloadp));
          };
          this.server.to(this.room_idC).emit("puck update chat", (payload));
        }
        setTimeout(this.updateBallChat.bind(this), this.timeC); // Bind the `this` context to the function
      }
    }
  

        @SubscribeMessage('KeyReleased chat')
        async KeyRealaesedChat(socket: Socket) {
          this.paddle_leftC.move(0);
          this.paddle_rightC.move(0);
        }

        @SubscribeMessage('KeyPressed chat')
        async KeyPressedC(socket: Socket, gamedata : any) { 
          if (gamedata.id == this.paddle_leftC.id)
          {
            if (gamedata.key == 'w')
            {
              this.paddle_leftC.move(-20);
            }
            if (gamedata.key == 's')
            {
              this.paddle_leftC.move(20);
            }
          }
          else if (gamedata.id == this.paddle_rightC.id)
          {
            if (gamedata.key == 'w')
            {
                this.paddle_rightC.move(-20);
            }
            else if (gamedata.key == 's')
            {
                this.paddle_rightC.move(20);
          }
          }
        }

        async addscoreC(id_room: string) {
          this.isGameStartC = false;
          this.sockC.delete(this.paddle_leftC.id);
          this.sockC.delete(this.paddle_rightC.id);
          this.socknC.delete(this.paddle_leftC.id);
          this.socknC.delete(this.paddle_rightC.id);
          const luser = await this.userService.findOnebyId2(this.paddle_leftC.id)
          const ruser = await this.userService.findOnebyId2(this.paddle_rightC.id)
          if (this.puckC.left_score == this.fscoreC)
          {
            luser.wins += 1;
            ruser.losses += 1;
          }
          else if (this.puckC.right_score == this.fscoreC)
          {
            luser.losses += 1;
            ruser.wins += 1;
          }
          await this.userService.update(this.paddle_leftC.id, luser);
          await this.userService.update(this.paddle_rightC.id, ruser);

          const upgame = await this.gameService.findOne(Number(id_room))
          upgame.player1 = luser;
          upgame.player2 = ruser;
          upgame.score1 = this.puckC.left_score;
          upgame.score2 = this.puckC.right_score;
          await this.gameService.update(Number(id_room), upgame);
          if (this.user_leftC)
          this.server.to(id_room).emit("user left chat");
          setTimeout(this.end_game.bind(this, id_room),  5 * 1000)
        }

        @SubscribeMessage('join server all')
  async handleJoinServerAll(socket: Socket, userdata: {id: string, username: string}) {
  if (userdata.id == '' || userdata.username == '')
    return;
  const userIndex = this.allusers.findIndex((u) => u.id === userdata.id);
  if (userIndex >= 0) {
    this.allusers[userIndex].sockets.push(socket.id);
  } else {
    const user = {
      username: userdata.username,
      id: userdata.id,
      sockets: [socket.id],
    };
    this.allusers.push(user);
  }

  this.server.emit('connected all users', this.allusers);
  
}       
}
