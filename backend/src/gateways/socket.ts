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
  private games = new Map<number, GameProps>(); // gameid, gameprops
  private queue = new Map<number, User>();  // userid, user
  private sock = new Map<number, Socket>(); // userid, socket
  private queueE = new Map<number, User>(); // userid, user
  private sockE = new Map<number, Socket>();// userid, socket

  async handleConnection(socket: Socket) {
    console.log('Socket connected:', socket.id);
    const users = await this.messageService.findAll();
  }

 async handleDisconnect(socket: Socket) {
  console.log('Socket disconnected:', socket.id);
  if (this.isGameStart)
  {
    console.log("In Classic game")
    const user = this.getByValue(this.sock, socket);
    if (user)
    {
      this.isGameStart = false;
      if (user == this.paddle_left.id)
      {
        console.log("user to leave is ", this.paddle_left.name);
        this.puck.left_score = 0;
        this.puck.right_score = this.fscore
      }
      else if (user == this.paddle_right.id)
      {
        console.log("user to leave is ", this.paddle_right.name);
        this.puck.right_score = 0;
        this.puck.left_score = this.fscore
      }
    }
  }
  if (this.isGameStartE)
  {
    console.log("In Extra game")
    const user = this.getByValue(this.sockE, socket);
    if (user)
      console.log("We find the user ", user)
    else
      console.log("no user T-T");
  }
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
  if (channelNames.length === 0) {
    console.log("no chans");
    this.server.to(socket.id).emit('join room', { channels: channels });
  }
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
      console.log("????????owner SOCKET", channel.owner.username)
      const owner = channel.owner.username;

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
    const channels = await this.channelService.findAll()
     this.server.emit('new chan', channels ); // broadcast to all connected sockets
    //  this.server.to(socket.id).emit('new chan', { channelName: roomName}); // broadcast to all connected sockets
    }
  }


  @SubscribeMessage('create DM')
  async handleCreateDM(socket: Socket, datachan: any) {
    const { username1, username2 } = datachan;
 
    console.log(`SOCKET CREATE DM with (${username1}) and (${username2})`)
    
    const newChannel = await this.channelService.createDm(username1, username2);
    //  this.server.emit('new chan', this.channelService.findAll());

     const channels = await this.channelService.findAll()
     this.server.emit('new chan', channels );
    }
  

@SubscribeMessage('remove chan')
async handleRemoveChannel(socket: Socket, channelName: string) {

  console.log('removing channel', channelName)
  const existingChannel = await this.channelService.findOneByName(channelName);
  if (existingChannel) {
  console.log('existing channel', existingChannel.name, existingChannel.id)
    await this.channelService.remove(existingChannel.id);
    // this.server.emit('new chan', this.channelService.findAll());
    const channels = await this.channelService.findAll()
    this.server.emit('new chan', channels );
  } 
  // else {
  //   socket.emit('error', `Channel ${channelName} does not exist.`);
  // }
}

@SubscribeMessage('change password')
async handleChatPassword(socket: Socket, data: any) {
  const { userId, channelName, newPassword } = data;
  const updateChannelDto: UpdateChannelDto = {password: newPassword, name: channelName };

 await this.channelService.changeChannelPassword(userId, updateChannelDto);
//  this.server.emit('new chan', this.channelService.findAll());
 const channels = await this.channelService.findAll()
 this.server.emit('new chan', channels );

}

@SubscribeMessage('remove password')
async handleRemoveChatPassword(socket: Socket, data: any) {

const { userId, channelName } = data;

await this.channelService.removeChannelPassword(userId, channelName);
// this.server.emit('new chan', this.channelService.findAll());
const channels = await this.channelService.findAll()
this.server.emit('new chan', channels );

}


// @SubscribeMessage('check password')
// async handlecheckChatPassword(socket: Socket, data: any) {
//   const { userId, channelName, userInput } = data;
//   const bool = await this.channelService.isChannelPasswordCorrect(channelName, userInput);
//   console.log("channel pass is correct or not : ", bool);
//   this.server.to(socket.id).emit('is userinput correct', bool);
// }

@SubscribeMessage('add member')
async handleAddMember(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  const bool = await this.channelService.addMember(channelName, AdminId, username);
  this.server.emit("member adding", {memberadded: bool, username: username})
  // this.server.emit('new chan', this.channelService.findAll());
  const channels = await this.channelService.findAll()
  this.server.emit('new chan', channels );
}


@SubscribeMessage('add admin')
async handleAddAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;
    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.addAdmin(channelName, AdminId, username);
//  this.server.emit('new chan', this.channelService.findAll());
 const channels = await this.channelService.findAll()
 this.server.emit('new chan', channels );
}

@SubscribeMessage('remove admin')
async handleRemovAdmin(socket: Socket, payload: any) {
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeAdmin(channelName, AdminId, username);
//  this.server.emit('new chan', this.channelService.findAll());
 const channels = await this.channelService.findAll()
 this.server.emit('new chan', channels );
}


@SubscribeMessage('remove member')
async handleRemoveMember(socket: Socket, payload: any) {
  console.log("socket remove member")
  const { channelName, AdminId, username } = payload;

    console.log(channelName, AdminId, username)
  const chan = await this.channelService.findOneByName(channelName);
  await this.channelService.removeMember(channelName, AdminId, username);
  // this.server.emit('new chan', this.channelService.findAll());
  const channels = await this.channelService.findAll()
  this.server.emit('new chan', channels );
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
  // this.server.emit('new chan', this.channelService.findAll());
  const channels = await this.channelService.findAll()
  this.server.emit('new chan', channels );
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


  @SubscribeMessage('sendInvitation')
  async handlePongInvite(socket: Socket, data : any) {

    const { sender , receiver, chatName} = data;

    const senderr = await this.userService.findOneByName(sender);
    const receiverr = await this.userService.findOneByName(receiver);
    const receiverUser = this.users.find(user => user.username === receiverr.username);
    console.log("//////********receiverUser",  receiverUser)

    if (receiverUser) {
    console.log("in receiver user", receiverUser)
      const receiverSockets = receiverUser.sockets;
      receiverSockets.forEach(receiverSocket => {
        this.server.to(receiverSocket).emit('receiveInvitation', { sender: senderr, receiver : receiver, chatName : chatName});
      });
    } 
  // else {
  //   // Handle the case when the receiver is not found or does not have any active sockets
  //   // You can emit an error event or take appropriate action.
  // }
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
  player1: User;
  player2: User;
  speed = 1;
  time = 25;
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
        console.log("game id is ", game.id)
      } // generate the data id
      const user = await this.userService.findOnebyId(userid);
      console.log("user is ", user.username);
      console.log("queue size is ", this.queue.size);
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
        if (this.server.sockets.adapter.rooms.get(this.room_id).size === 2) 
        { // we have 2 people so start game
          this.queue.delete(this.player1.id);
          this.queue.delete(this.player2.id);
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
          this.width = gamedata.width;
          this.height = gamedata.height;
          this.puck = new Puck(this.width, this.height, false);
          if (!this.paddle_left)
          {
            this.paddle_left = new Paddle(this.width, this.height, true, false, this.player1.id, this.player1.username)
            this.sock.set(this.player1.id, socket);
            console.log("@@@socket 1 " + socket + " avec player " + this.player1.username + " avec userid " + this.player1.id);
          }
          if (!this.paddle_right)
          {
            this.paddle_right = new Paddle(this.width, this.height, false, false, this.player2.id, this.player2.username)
            this.sock.set(this.player2.id, socket);
            console.log("@@@socket 2 " + socket + " avec player " + this.player2.username + " avec userid " + this.player2.id)
          }
          await socket.join(this.room_id);
          console.log("&&&&&&&& socket room size is ", this.server.sockets.adapter.rooms.get(this.room_id).size)
          console.log("sock size is ", this.sock.size)
          console.log("isGameStart is " + this.isGameStart)
          if (this.server.sockets.adapter.rooms.get(this.room_id).size == 2 && this.isGameStart == false) 
            { // si on a deux user start game 
              console.log("---------------------- LA POUR WOUAIS ---------------------------")
              console.log("***********************##############****************************")
              console.log("***********************####1111######****************************")
              console.log("***********************####1111######****************************")
              console.log("***********************####1111######****************************")
              console.log("***********************####1111######****************************")
              console.log("***********************####1111######****************************")
              console.log("***********************##############****************************")
              console.log("user enter with isGameStart ", this.isGameStart);
              if (this.paddle_left.id == this.paddle_right.id)
              {
                console.log("lalalalalaa T-T")
                socket.emit("same personne error", {
                  error: "You canno't join with 2 tab!",
                });
                return ;
              }
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
          console.log("pass par addscore")
          console.log("left score " + this.puck.left_score + " user " + this.paddle_left.name)
          console.log("right score " + this.puck.right_score + " user " + this.paddle_right.name)
          this.isGameStart = false;
          this.sock.delete(this.paddle_left.id);
          this.sock.delete(this.paddle_right.id);
          const luser = await this.userService.findOnebyId2(this.paddle_left.id)
          const ruser = await this.userService.findOnebyId2(this.paddle_right.id)
          if (this.puck.left_score == this.fscore)
          {
            console.log("left win")     
            luser.wins += 1;
            ruser.losses += 1;
          }
          else if (this.puck.right_score == this.fscore)
          {
            console.log("right win")
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
          console.log("***** game update : left score " +  this.puck.left_score + " right score " + this.puck.right_score)
          await this.gameService.update(Number(id_room), upgame);
          setTimeout(this.end_game.bind(this, id_room),  10 * 1000)
        }
        
        end_game(id_room: string) {
          this.server.to(id_room).emit("end game");
          this.room_id = "";
        }

        // function helper to game position
    updateBall() {
      //console.log("do something, I am a loop, in 1000 miliseconds, ill be run again");
      if (!this.isGameStart || this.puck.left_score == this.fscore || this.puck.right_score == this.fscore) {
        console.log("we have game start " + this.isGameStart + "; left score is " + this.puck.left_score + "; and right score id " + this.puck.right_score)
        this.addscore(this.room_id);
        // socket emit
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
    getByValue(map : Map<number, Socket>, searchValue: Socket) {
      for (let [key, value] of map.entries()) {
        if (value === searchValue)
          return key;
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
      console.log("user is ", user.username)
      console.log("gamid is ", this.room_idE)
      console.log("queue size is ", this.queueE.size)
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
        
        if (this.server.sockets.adapter.rooms.get(this.room_idE).size === 2) 
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
      this.heightE = gamedata.height;
      this.widthE = gamedata.width;
      this.puckE = new Puck(this.widthE, this.heightE, true);
      if (!this.paddle_leftE)
        this.paddle_leftE = new Paddle(this.widthE, this.heightE, true, true, gamedata.id, gamedata.name)
      else
        this.paddle_rightE = new Paddle(this.widthE, this.heightE, false, true, gamedata.id, gamedata.name)
      await socket.join(this.room_idE);
      if (this.server.sockets.adapter.rooms.get(this.room_idE).size === 2) 
      { // si on a deux user start game 
        this.isGameStartE = true;
        this.updateBallExtra(socket);
      }
    }

    updateBallExtra(socket: Socket) {
      if (!this.isGameStartE || this.puckE.left_score == this.fscoreE || this.puckE.right_score == this.fscoreE) {
        console.log("game extra start is ", this.isGameStartE)
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
            this.paddle_leftE.update();
            this.paddle_rightE.update();
            const payloadp = {prx: this.paddle_rightE.x, pry: this.paddle_rightE.y, prw: this.paddle_rightE.w, prh: this.paddle_rightE.h, pln: this.paddle_leftE.name, plx: this.paddle_leftE.x, ply: this.paddle_leftE.y, plw: this.paddle_leftE.w, plh: this.paddle_leftE.h, prn: this.paddle_rightE.name}
            this.server.to(this.room_idE).emit("paddle update", (payloadp));
          };
          this.server.to(this.room_idE).emit("puck update", (payload));
        }
        setTimeout(this.updateBallExtra.bind(this, socket), this.timeE); // Bind the `this` context to the function
      }
    }

    @SubscribeMessage('KeyPressed extra')
    async KeyPressed(socket: Socket, gamedata : any) { 
      if (gamedata.name == this.paddle_leftE.name)
      {
        if (gamedata.key == 'j')
        {
          this.paddle_leftE.move(-10 * this.speedE);
        }
        if (gamedata.key == 'n')
        {
          this.paddle_leftE.move(10 * this.speedE);
        }
      }
      else if (gamedata.name == this.paddle_rightE.name)
      {
        if (gamedata.key == 'j')
        {
            this.paddle_rightE.move(-10 * this.speedE);
        }
        else if (gamedata.key == 'n')
        {
            this.paddle_rightE.move(10 * this.speedE);
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
      const luser = await this.userService.findOnebyId2(this.paddle_leftE.id)
      const ruser = await this.userService.findOnebyId2(this.paddle_rightE.id)
      if (this.puckE.left_score = this.fscoreE)
      {              
        luser.wins += 1;
        ruser.losses += 1;
      }
      else if (this.puckE.right_score = this.fscoreE)
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
      setTimeout(this.end_game.bind(this, id_room),  10 * 1000)
    }

    @SubscribeMessage("chat pong")
    chat_pong(socket: Socket, payload : any)
    {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      console.log("we are in chat pong")
      /*console.log("user 1 ", payload.userid);
      console.log("user 2 ", payload.username);*/
      //this.server.emit("in game");
    }


}
