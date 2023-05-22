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
  private messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: [],
  };
  private games = new Map<number, GameProps>();

  async handleConnection(socket: Socket) {
    console.log('Socket connected:', socket.id);
    const users = await this.messageService.findAll();
  }

 async handleDisconnect(socket: Socket) {
  console.log('Socket disconnected:', socket.id);
  const userIndex = this.users.findIndex((u) => u.sockets.includes(socket.id));
  if (userIndex >= 0) {
    this.users[userIndex].sockets = this.users[userIndex].sockets.filter((s) => s !== socket.id);
    console.log(`${this.users[userIndex].username}' just closed a tab: with socketid ${socket.id} `);
    if (this.users[userIndex].sockets.length === 0) {
      const disconnectedUser = this.users.splice(userIndex, 1)[0];
      console.log(`${disconnectedUser.username} (${disconnectedUser.id}) has disconnected`);
    }
  }
  this.server.emit('connected users', this.users);
}

@SubscribeMessage('all users')
async handleGetUsers(socket: Socket, userdata: {id: number, name: string}) {
  const currentuser = await this.userService.findOnebyId(userdata.id);
  const allusers = await this.userService.findAll();
console.log("SOCKET ALL USERS", currentuser.username)
  const payload = {
    currentuser,
    allusers,
  };
  this.server.to(socket.id).emit('all users', payload);

}

@SubscribeMessage('join server')
async handleJoinServer(socket: Socket, userdata: {id: number, name: string}) {
  console.log('join server');
  const userIndex = this.users.findIndex((u) => u.id === userdata.id);
  if (userIndex >= 0) {
    this.users[userIndex].sockets.push(socket.id);
    console.log(this.users[userIndex], 'just opened a new tab');
  } else {
    const user = {
      username: userdata.name,
      id: userdata.id,
      sockets: [socket.id],
    };
    this.users.push(user);
    console.log(user, 'just joined server');
  }
  console.log("userdata id and name", userdata.id, userdata.name)
  const channels = await this.channelService.getChannelsforUser(userdata.id); //petits bugs a checker quand deux users differents se log et refresh la page
  if (channels) {
  const channelNames = channels.map(channel => channel.name);
  console.log("CHANNELLNAMES ???", channelNames);
   this.server.to(socket.id).emit('all chans',channelNames);
   this.server.emit('connected users', this.users);
    for (const channel of channels) {
      const channelName = channel.name;
      const accessType = channel.accessType;
      const blockedUsers =  await this.userService.getBlockedUsers(userdata.id);
      const blockedusernames = blockedUsers?.map(user => user.username);
      const channelMessages = await this.channelService.findMessagesByChatname(channelName, blockedUsers);
      const members = channel.members?.map(user => user.username);
      const mutedMembers = channel.mutedMembers?.map(user => user.username);
      const admins = channel.admins?.map(user => user.username);
      const bannedmembers = channel.bannedUsers?.map(user => user.username);
      const owner = channel.owner.username;
      // console.log("owner SOCKET", owner)
      socket.join(channelName);
      if (!this.messages[channelName]) {
        this.messages[channelName] = []; // add new room if it doesn't exist
      }
      // console.log(
      //   socket.id,
      //   'just joined rooOOOOm',
      //   channelName, 'access type:',
      //   accessType,
      //   channelMessages,
      // );
      this.messages[channelName].push(...channelMessages);
      // console.log("members and admins AAAAAAARE", admins, members)
      // console.log("THIS MESSAGES AFTER!!!!!! for ", channelName, this.messages[channelName]);
       this.server.to(socket.id).emit('join room', { room: channelName, accessType: accessType, messages: channelMessages, members: members, admins: admins, bannedmembers: bannedmembers, mutedMembers:mutedMembers, owner: owner, blockedUsers: blockedusernames, channels: channels }); // send all messages for all rooms
      console.log("ALL USERS CHANS SOCKET")
       this.server.to(socket.id).emit("all user's chans", channels);
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
    //  this.server.to(socket.id).emit('new chan', { channelName: roomName}); // broadcast to all connected sockets
    }
  }


  @SubscribeMessage('create DM')
  async handleCreateDM(socket: Socket, datachan: any) {
    const { username1, username2 } = datachan;
 
    console.log(`SOCKET CREATE DM with (${username1}) and (${username2})`)
    
    const newChannel = await this.channelService.createDm(username1, username2);
     this.server.emit('new chan', this.channelService.findAll());
    }
  

@SubscribeMessage('remove chan')
async handleRemoveChannel(socket: Socket, channelName: string) {

  console.log('removing channel', channelName)
  const existingChannel = await this.channelService.findOneByName(channelName);
  if (existingChannel) {
  console.log('existing channel', existingChannel.name, existingChannel.id)
    await this.channelService.remove(existingChannel.id);
    this.server.emit('new chan', this.channelService.findAll());
  } else {
    socket.emit('error', `Channel ${channelName} does not exist.`);
  }
}

@SubscribeMessage('change password')
async handleChatPassword(socket: Socket, data: any) {
  const { userId, channelName, newPassword } = data;
  const updateChannelDto: UpdateChannelDto = {password: newPassword, name: channelName };

 await this.channelService.changeChannelPassword(userId, updateChannelDto);
 this.server.emit('new chan', this.channelService.findAll());

}

@SubscribeMessage('remove password')
async handleRemoveChatPassword(socket: Socket, data: any) {

const { userId, channelName } = data;

await this.channelService.removeChannelPassword(userId, channelName);
this.server.emit('new chan', this.channelService.findAll());

}


@SubscribeMessage('check password')
async handlecheckChatPassword(socket: Socket, data: any) {
  const { userId, channelName, userInput } = data;
  const bool = await this.channelService.isChannelPasswordCorrect(channelName, userInput);
  console.log("channel pass is correct or not : ", bool);
  this.server.to(socket.id).emit('is userinput correct', bool);
}

@SubscribeMessage('add member')
async handleAddMember(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  const bool = await this.channelService.addMember(channelName, AdminId, username);
  this.server.emit("member adding", {memberadded: bool, username: username})
  this.server.emit('new chan', this.channelService.findAll());
}


@SubscribeMessage('add admin')
async handleAddAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;
    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.addAdmin(channelName, AdminId, username);
 this.server.emit('new chan', this.channelService.findAll());
}

@SubscribeMessage('remove admin')
async handleRemovAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeAdmin(channelName, AdminId, username);
 this.server.emit('new chan', this.channelService.findAll());
}


@SubscribeMessage('remove member')
async handleRemoveMember(socket: Socket, payload: any) {
  console.log("socket remove member")
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeMember(channelName, AdminId, username);
  this.server.emit('new chan', this.channelService.findAll());
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
  this.server.emit('new chan', this.channelService.findAll());
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
    socket.join(roomName);
    if (!this.messages[roomName]) {
      this.messages[roomName] = []; // add new room if it doesn't exist
    }
    socket.emit('join room', this.messages[roomName]);
  }

  @SubscribeMessage('send message')
  async handleMessage(socket: Socket, data: any) {
    if (data) {
      const { content, to, sender, senderid, chatName, isChannel } = data;
    
    console.log(socket.id, "just sent a message", data)
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
  player1: string;
  player2: string;
  speed = 1;
  // data i use for the logistic


    // join classic game from home page
@SubscribeMessage("join_game")
  public async joinGame( 
        socket: Socket,
        data : any) 
    {
      const {message, userid, username} = data;
      if (!this.room_id)
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
     const connectedSockets = this.server.sockets.adapter.rooms.get(this.room_id);
      if ((connectedSockets && connectedSockets.size === 1))
      {
        const game = await this.gameService.findOne(Number(this.room_id))
        if (this.player2 && username === this.player2)
        {
          return ; // same person so return
        }
        const user = await this.userService.findOnebyId(userid)
        const up : UpdateUserDto = {
          gamePlayer1: [game],
        };
        await this.userService.update(userid, up);
        this.player1 = user.username; // set the player 1
      }
      else
      {
        const game = await this.gameService.findOne(Number(this.room_id))
        if (this.player1 && username === this.player1)
        {
          return ; // same person so return
        }
        const user = await this.userService.findOnebyId(userid)
        const up : UpdateUserDto = {
          gamePlayer2: [game],
        };
        await this.userService.update(userid, up);
        this.player2 = user.username; // set the player 2
      } // a revoir -> i dont think that works 
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
        if (this.server.sockets.adapter.rooms.get(this.room_id).size === 2) 
        { // we have 2 people so start game
          this.server.to(this.room_id).emit("start_game", {});
        }
      }
    }
        
        // start game from pong.txt 
        @SubscribeMessage('start game')
        async handleJoinGameServer(socket: Socket, gamedata : any) {
          // this have to be change for the responssive
          // and set the width and height to 500 / 500
          this.width = gamedata.width;
          this.height = gamedata.height;
          this.puck = new Puck(this.width, this.height);
          if (!this.paddle_left)
            this.paddle_left = new Paddle(this.width, this.height, true, false, gamedata.id, gamedata.name)
          else
            this.paddle_right = new Paddle(this.width, this.height, false, false, gamedata.id, gamedata.name)
          await socket.join(this.room_id);
          if (this.server.sockets.adapter.rooms.get(this.room_id).size === 2) 
          { // si on a deux user start game 
            this.isGameStart = true;
            this.updateBall(socket);
          }
        }
  

        @SubscribeMessage('KeyReleased')
        async KeyRealaesed(socket: Socket) {
          this.paddle_left.move(0);
          this.paddle_right.move(0);
        }

        @SubscribeMessage('KeyPressed')
        async KeyPressedr(socket: Socket, gamedata : any) { 
          if (gamedata.name == this.paddle_left.name)
          {
            if (gamedata.key == 'j')
            {
              this.paddle_left.move(-10);
            }
            if (gamedata.key == 'n')
            {
              this.paddle_left.move(10);
            }
          }
          else if (gamedata.name == this.paddle_right.name)
          {
            if (gamedata.key == 'j')
            {
              console.log("back keyPressed up ", gamedata.name)
                this.paddle_right.move(-10);
            }
            else if (gamedata.key == 'n')
            {
              console.log("back keyPressed down ", gamedata.name)
                this.paddle_right.move(10);
          }
          }
        }

        async addscore(id_room: string) {
          console.log("PASSE PAR ADD SCORE BACK")
          const luser = await this.userService.findOnebyId(this.paddle_left.id)
          const ruser = await this.userService.findOnebyId(this.paddle_right.id)
          const lwin = luser.wins;
          const rlose = ruser.losses;
          const llose = luser.losses;
          const rwin = ruser.wins;
          if (this.puck.left_score = this.fscore)
          {              
            luser.wins += 1;
            ruser.losses += 1;
          }
          else if (this.puck.right_score = this.fscore)
          {
            luser.losses += 1;
            ruser.wins += 1;
          }
              const updateuserdto : UpdateUserDto = {
                wins : luser.wins,
                losses: luser.losses,
              }

              const updateuserdto2 : UpdateUserDto = {
                wins : ruser.wins,
                losses: ruser.losses,
              }
              // await this.userService.update(this.paddle_left.id, updateuserdto);
              // await this.userService.update(this.paddle_right.id, updateuserdto2);
              // here true await this.userService.update(this.paddle_left.id, luser);
              // here true await this.userService.update(this.paddle_right.id, ruser);
              setTimeout(this.end_game.bind(this, id_room),  10 * 1000)
        }
        
        end_game(id_room: string) {
          this.server.to(id_room).emit("end game");
        }

        // function helper to game position
    updateBall(socket: Socket) {
      //console.log("do something, I am a loop, in 1000 miliseconds, ill be run again");
      if (!this.isGameStart || this.puck.left_score == this.fscore || this.puck.right_score == this.fscore) {
        this.addscore(this.room_id);
        // socket emit
        return;
      }
      else {
        if (this.puck) { // Check if this.puck is defined
          this.puck.update();
          this.puck.edges();
          this.puck.checkPaddleLeft(this.paddle_left, false, 0);
          this.puck.checkPaddleRight(this.paddle_right, false, 0);
          const payload = {x : this.puck.x, y : this.puck.y, lscore: this.puck.left_score, rscore: this.puck.right_score}
          if (this.paddle_left && this.paddle_right)
          {
            this.paddle_left.update();
            this.paddle_right.update()
            const payloadp = {prx: this.paddle_right.x, pry: this.paddle_right.y, prw: this.paddle_right.w, prh: this.paddle_right.h, pln: this.paddle_left.name, plx: this.paddle_left.x, ply: this.paddle_left.y, plw: this.paddle_left.w, plh: this.paddle_left.h, prn: this.paddle_right.name}
            this.server.to(this.room_id).emit("paddle update", (payloadp));
          };
          this.server.to(this.room_id).emit("puck update", (payload));
        }
        setTimeout(this.updateBall.bind(this, socket), 30); // Bind the `this` context to the function
      }
    }


    ///////////////////////: Extra Game /////////////////////
    // join game extra from home_game
    @SubscribeMessage("join_game_extra")
    public async joinExtraGame( 
      socket: Socket,
      data : any)
    {
      const {message, userid, username} = data;
      if (!this.room_id)
      {
        const gameDto: CreateGameDto = {
          score1 : 0,
          score2 : 0,
        };
        const game = await this.gameService.create(gameDto);
        if (!game)
          return ;
        this.room_id = game.id.toString();
      } // generate id game
      const connectedSockets = this.server.sockets.adapter.rooms.get(this.room_id);
      if ((connectedSockets && connectedSockets.size === 1))
      {
        const game = await this.gameService.findOne(Number(this.room_id))
        if (this.player2 && username === this.player2)
        {
          return ;
        }
        const user = await this.userService.findOnebyId(userid)
        const up : UpdateUserDto = {
          gamePlayer1: [game],
        };
        await this.userService.update(userid, up);
        this.player1 = user.username;
      }
      else
      {
        const game = await this.gameService.findOne(Number(this.room_id))
        if (this.player1 && username === this.player1)
        {
          return ;
        }
        const user = await this.userService.findOnebyId(userid)
        const up : UpdateUserDto = {
          gamePlayer2: [game],
        };
        await this.userService.update(userid, up);
        this.player2 = user.username;
      } // a revoir 
      const socketRooms = Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
      if ( socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2))
      { // already 2 people in the room
        socket.emit("room_join_error", {
          error: "Room is full please wait the game end to play!",
        });
      } else {
        await socket.join(this.room_id);
        this.server.emit("room_joined");
        
        if (this.server.sockets.adapter.rooms.get(this.room_id).size === 2) 
        { // we have 2 people to play
          this.server.to(this.room_id).emit("start_game_extra", {});
        }
      }
    }

    @SubscribeMessage('start game extra')
    async handleJoinGameServerExtra(socket: Socket, gamedata : any) {
      // this have to be change for the responssive
      // and set the width and height to 500 / 500
      this.width = gamedata.width;
      this.height = gamedata.height;
      this.puck = new Puck(this.width, this.height);
      if (!this.paddle_left)
        this.paddle_left = new Paddle(this.width, this.height, true, true, gamedata.id, gamedata.name)
      else
        this.paddle_right = new Paddle(this.width, this.height, false, true, gamedata.id, gamedata.name)
      await socket.join(this.room_id);
      if (this.server.sockets.adapter.rooms.get(this.room_id).size === 2) 
      { // si on a deux user start game 
        this.isGameStart = true;
        this.updateBallExtra(socket);
      }
    }

    updateBallExtra(socket: Socket) {
      //console.log("do something, I am a loop, in 1000 miliseconds, ill be run again");
      if (!this.isGameStart || this.puck.left_score == this.fscore || this.puck.right_score == this.fscore) {
        this.addscore(this.room_id);
        // socket emit
        return;
      }
      else {
        if (this.puck) { // Check if this.puck is defined
          this.puck.update();
          this.puck.edges();
          this.speed = this.puck.checkPaddleLeft(this.paddle_left, false, this.speed);
          this.speed = this.puck.checkPaddleRight(this.paddle_right, false, this.speed);
          const payload = {x : this.puck.x, y : this.puck.y, lscore: this.puck.left_score, rscore: this.puck.right_score}
          if (this.paddle_left && this.paddle_right)
          {
            this.paddle_left.update();
            this.paddle_right.update()
            const payloadp = {prx: this.paddle_right.x, pry: this.paddle_right.y, prw: this.paddle_right.w, prh: this.paddle_right.h, pln: this.paddle_left.name, plx: this.paddle_left.x, ply: this.paddle_left.y, plw: this.paddle_left.w, plh: this.paddle_left.h, prn: this.paddle_right.name}
            this.server.to(this.room_id).emit("paddle update", (payloadp));
          };
          this.server.to(this.room_id).emit("puck update", (payload));
        }
        setTimeout(this.updateBall.bind(this, socket), 30); // Bind the `this` context to the function
      }
    }

    @SubscribeMessage('KeyPressed extra')
    async KeyPressed(socket: Socket, gamedata : any) { 
      if (gamedata.name == this.paddle_left.name)
      {
        if (gamedata.key == 'j')
        {
          this.paddle_left.move(-10 * this.speed);
        }
        if (gamedata.key == 'n')
        {
          this.paddle_left.move(10 * this.speed);
        }
      }
      else if (gamedata.name == this.paddle_right.name)
      {
        if (gamedata.key == 'j')
        {
            this.paddle_right.move(-10 * this.speed);
        }
        else if (gamedata.key == 'n')
        {
            this.paddle_right.move(10 * this.speed);
      }
      }
    }
}
