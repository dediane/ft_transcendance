import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Message } from 'src/message/entities/message.entity';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChannelService {
  static findAll() {
    throw new Error("Method not implemented.");
}
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
 ) {}

  async create(createChannelDto: CreateChannelDto) {
    const channel = this.channelRepository.create(createChannelDto);
    return this.channelRepository.save(channel);
  }

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    const channel = this.channelRepository.create(createChannelDto);
    return this.channelRepository.save(channel);
  }
  
  //si valeur n'existe pas dans l'entity et appel a  sur leftJoinAndSelect('channel.admins', 'admin') va mettre ce message d'erreur [Nest] 24976  - 04/24/2023, 9:41:03 PM   ERROR [WsExceptionsHandler] Relation with property path invitedUsers in entity was not found.
  async findAll() {
    const channels = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.owner', 'owner')
      .leftJoinAndSelect('channel.members', 'member')
      .leftJoinAndSelect('channel.bannedUsers', 'bannedUser')
      .leftJoinAndSelect('channel.mutedMembers', 'mutedMember')
      .leftJoinAndSelect('channel.admins', 'admin')
      .leftJoinAndSelect('channel.messages', 'message')
      .select(['channel.name', 'channel.dm', 'channel.id', 'channel.accessType', 'owner.username', 'channel.password', 'member.username', 'member.id', 'admin.username', 'bannedUser.username', 'mutedMember.username',  'message.content'])
      .getMany();
    return channels;
  }
  
  async findOne(id: number): Promise<Channel | undefined> {
    if (isNaN(id)) {
      return undefined; 
    }
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .where('channel.id = :id', { id })
      .leftJoinAndSelect('channel.members', 'members')
      .leftJoinAndSelect('channel.bannedUsers', 'bannedUsers')
      .leftJoinAndSelect('channel.admins', 'admins')
      .leftJoinAndSelect('channel.mutedMembers', 'mutedMembers')
      .leftJoinAndSelect('channel.owner', 'owner')
      .select(['channel.id', 'channel.name', 'members.username', 'bannedUsers.username', 'admins.username', 'mutedMembers.username', 'owner.username'])
      .getOne();
    return channel;
  }

  async findOneByName(name: string): Promise<Channel | undefined> {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .where('channel.name = :name', { name })
      .leftJoinAndSelect('channel.members', 'members')
      .leftJoinAndSelect('channel.bannedUsers', 'bannedUsers')
      .leftJoinAndSelect('channel.admins', 'admins')
      .leftJoinAndSelect('channel.mutedMembers', 'mutedMembers')
      .leftJoinAndSelect('channel.owner', 'owner')
      .select(['channel.id', 'channel.name', 'members', 'bannedUsers', 'admins', 'mutedMembers', 'owner'])
      .getOne();
  
    return channel;
  }
  async isUserBanned(channelName: string, user: User): Promise<boolean> {
    const channel = await this.findOneByName(channelName);
    if (!channel) {
      return false;
    }
    return channel.bannedUsers.some(banneduser => banneduser.id === user.id);
  }


  async isUserAdmin(channelName: string, user: User): Promise<boolean> {
    const channel = await this.findOneByName(channelName);
    if (!channel) {
      return false;
    }
    return channel.admins.some(admin => admin.id === user.id);
  }


  async isUserOwner(channelName: string, user: User): Promise<boolean> {
    const channel = await this.findOneByName(channelName);
    if (!channel || !channel.owner) {
      return false;
    }
    return channel.owner.id === user.id;
  }
  
async isChanPublic(channelName: string): Promise<boolean> {
  const channel = await this.channelRepository.createQueryBuilder('channel')
    .where('channel.name = :channelName', { channelName })
    .andWhere('channel.password IS NULL') // exclude password-protected channels
    .getOne();

  return !!channel && !channel.dm;
}


async isChanPasswordProtected(channelName: string): Promise<boolean> {
  const channel = await this.channelRepository
    .createQueryBuilder('channel')
    .where('channel.name = :name', { name: channelName })
    .andWhere('channel.password IS NOT NULL')
    .select('channel.id')
    .getOne();

  return !!channel;
}

async isChanPrivate(channelName: string): Promise<boolean> {
  const channel = await this.channelRepository
    .createQueryBuilder('channel')
    .where('channel.name = :name', { name: channelName })
    .andWhere('channel.dm = true') // include DMs
    .leftJoinAndSelect('channel.members', 'members')
    .select(['channel.id', 'channel.name', 'members'])
    .getOne();

  return !!channel && channel.members.length > 0;
}

async findMessagesByChatname(chatname: string, blockedUsers: User[]): Promise<{ content: string, chatName: string, sender: string }[]> {
    const messages = await this.messageRepository
    .createQueryBuilder('message')
    .leftJoin('message.channel', 'channel')
    .leftJoin('message.sender', 'sender')
    .select(['message.content', 'channel.name', 'sender.username', 'sender.id'])
    .where('channel.name = :chatname', { chatname })
    .getMany();
  
  return messages
    .filter(message => !blockedUsers.some(user => user.id === message.sender?.id))
    .map(message => {
      const { content, channel } = message;
      const sender = message.sender ? message.sender.username : null;
      return {
        content,
        chatName: channel.name,
        sender,
      };
    });
  }

  async findAdmins(channel: Channel): Promise<User[]> {
    const admins = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.admins', 'admin')
      .where('channel.id = :channelId', { channelId: channel.id })
      .getOneOrFail();
  
    return admins.admins;
  }
  
  async findMembers(channel: Channel): Promise<User[]> {
    const members = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.members', 'member')
      .where('channel.id = :channelId', { channelId: channel.id })
      .getOneOrFail();
  
    return members.members;
  }
  
async update(id: number, updateChannelDto: UpdateChannelDto): Promise<Channel> {
  const channel = await this.channelRepository.findOne({ where: { id } });
  if (!channel) {
    throw new Error(`Channel with ID ${id} not found`);
  }
  
  Object.assign(channel, updateChannelDto);
  return this.channelRepository.save(channel);
}

async getChannelPassword(name: string) : Promise<string>{ 
  console.log("channel name", name);
  const channel = await this.channelRepository.createQueryBuilder('channel')
    .select('channel.password')
    .where('channel.name = :name', { name })
    .getOne();

  return channel ? channel.password : null;
}

async isChannelPasswordCorrect(channelName: string, userInput: string): Promise<boolean> {
  const channelPassword = await this.getChannelPassword(channelName);
  console.log("userinput is ", userInput);
  return channelPassword === userInput;
}


async getPublicChannels(): Promise<Channel[]> {
  const channels = await this.channelRepository.createQueryBuilder('channel')
    .where('channel.dm = false') // exclude DMs
    .leftJoinAndSelect('channel.members', 'members')
    .select(['channel.id', 'channel.name', 'members'])
    .getMany();

  return channels;
}


async getPublicProtected(): Promise<Channel[]> {
  const channels = await this.channelRepository.createQueryBuilder('channel')
    .leftJoinAndSelect('channel.owner', 'owner')
    .leftJoinAndSelect('channel.members', 'member')
    .leftJoinAndSelect('channel.bannedUsers', 'bannedUser')
    .leftJoinAndSelect('channel.mutedMembers', 'mutedMember')
    .leftJoinAndSelect('channel.admins', 'admin')
    .leftJoinAndSelect('channel.messages', 'message')
    .select([
      'channel.name',
      'channel.dm',
      'channel.id',
      'channel.accessType',
      'owner.username',
      'channel.password',
      'member.username',
      'admin.username',
      'bannedUser.username',
      'mutedMember.username',
      'message.content'
    ])
    .where('channel.accessType IN (:...accessTypes)', { accessTypes: ['protected', 'public'] })
    .getMany();

  return channels;
}


async getPrivateChannelsforUser(userId: number): Promise<Channel[]> {
  const allChannels = await this.findAll();

  const userChannels = allChannels.filter(channel =>
    channel.accessType === 'private' && channel.members.find(member => member.id === userId)
  );

  return userChannels;
}


async getPublicAndProtectedChannelsForUser(userId: number): Promise<Channel[]> {
  const allChannels = await this.findAll();

  const userChannels = allChannels.filter(channel =>
    channel.accessType !== 'private');

  return userChannels;
}

async getChannelsforUser(userId: number): Promise<Channel[]> {
  const allChannels = await this.findAll();
// console.log("GET CHANNELS FOR USER", allChannels)
  const privateChannels = allChannels.filter(channel =>
    channel.accessType === 'private' && channel.members.find(member => member.id === userId)
  );

  const publicAndProtectedChannels = allChannels.filter(channel =>
    channel.accessType !== 'private'
  );

  const userChannels = [...privateChannels, ...publicAndProtectedChannels];

  return userChannels;
}



async removeChannelPassword(userId: string, channelName: string): Promise<boolean> {
  // Check if user is the owner of the channel
  const channel = await this.channelRepository.createQueryBuilder('channel')
    .leftJoin('channel.owner', 'owner')
    .where('channel.name = :name', { name: channelName })
    .andWhere('owner.id = :userId', { userId })
    .getOne();

  if (!channel) {
    throw new Error('Channel not found or user is not the owner');
  }

  await this.channelRepository.update(channel.id, {
    password: null,
    accessType: 'public',
  });

  return true;
}


async changeChannelPassword(userId: string, updateChannelDto: UpdateChannelDto): Promise<boolean> {
  // Check if user is the owner of the channel
  const channel = await this.channelRepository.createQueryBuilder('channel')
    .leftJoin('channel.owner', 'owner')
    .where('channel.name = :name', { name: updateChannelDto.name })
    .andWhere('owner.id = :userId', { userId })
    .getOne();

  if (!channel) {
    throw new Error('Channel not found or user is not the owner');
  }

  await this.channelRepository.update(channel.id, {
    password: updateChannelDto.password,
    accessType: 'protected',
  });

  return true;
}

async addMember(channelName: string, adminId: number, username: string) : Promise<boolean> 
{
  const channel = await this.findOneByName(channelName);
  if (!channel)
    return false;
  const user = await this.userService.findOneByName(username);
  if (!user)
    return false;

  if(!channel.members) {
    channel.members = []
  }
  channel.members.push(user)
  await this.channelRepository.save(channel);
  return true;
  }




async addAdmin(channelName: string, adminId: number, username: string) : Promise<Channel | undefined> 
{
  const channel = await this.findOneByName(channelName);

//   // Add the admin to the channel's admin list
  const user = await this.userService.findOneByName(username);

  if(!channel.admins) {
    channel.admins = []
  }
  channel.admins.push(user)
  const result = await this.channelRepository.save(channel);
    return result;

    
  }

  async removeAdmin(channelName: string, adminId: number, username: string){
  const channel = await this.findOneByName(channelName);
  const isOwner = channel.owner.id === adminId;
  if(channel.admins) {
    for (var k = 0; k < channel.admins.length; k++)
    {
      if (channel.admins[k].username === username)
      channel.admins.splice(k, 1)
    }
    await this.channelRepository.save(channel);
  }
}

async removeMember(channelName: string, adminId: number, username: string){

  console.log("REMOVE MEMBER CALLED SERVICE ADMINDID IS", adminId)
  const channel = await this.findOneByName(channelName);
  const isOwner = channel.owner.id === adminId;

  if(channel.members) {
    for (var k = 0; k < channel.members.length; k++)
    {
      if (channel.members[k].username === username)
      channel.members.splice(k, 1)
    }
    await this.channelRepository.save(channel);
  }

  if(channel.admins) {
    for (var k = 0; k < channel.admins.length; k++)
    {
      if (channel.admins[k].username === username)
      channel.admins.splice(k, 1)
    }
    await this.channelRepository.save(channel);
  }
  if ((channel.admins.length === 0) && (channel.members.length === 0) )
    return;
  // const channel = await this.findOneByName(channelName);
  let newOwner;
  if (isOwner) {
  console.log("TRYING TO KICK OWNER")

    if (channel.admins.length === 0) {
  console.log("NO ADMIN SO CHOOSING A MEMBER AS NEW OWNER")

      // If the owner is the only admin, make the first member the new owner
      newOwner = channel.members[0];
    } else {
  console.log("THERE IS AN ADMIN SO CHOOSING AN ADMIN AS NEW OWNER")

      // Otherwise, the first remaining admin becomes the new owner
      newOwner = channel.admins[0];
    }

  await this.channelRepository.update(channel.id, {
    owner: newOwner
  });
}
}

async banMember(channelName: string, adminId: number, username: string){

  console.log("BAN MEMBER CALLED SERVICE")
  const channel = await this.findOneByName(channelName);

  const user = await this.userService.findOneByName(username);
 
  if(!channel.bannedUsers) {
    channel.bannedUsers = []
  }
  channel.bannedUsers.push(user)
  const result = await this.channelRepository.save(channel);
    return result;
}

async muteMember(channelName: string, adminId: number, username: string){
  console.log("MUTE MEMBER CALLED SERVICE");
  const channel = await this.findOneByName(channelName);
  const user = await this.userService.findOneByName(username);
  
  if (!channel) {
    throw new Error(`Channel ${channelName} not found`);
  }

  if (!user) {
    throw new Error(`User ${username} not found`);
  }

  const mutedUntil = new Date(Date.now() + 60 * 1000); // 1 minute, change to 120000 for 2 minutes
  console.log(user.username, "mutedUntil", mutedUntil);

  if (!channel.mutedMembers) {
    channel.mutedMembers = [];
    console.log("no muted members yet");
  }

  channel.mutedMembers.push(user);

  await this.channelRepository.save(channel);

  setTimeout(() => {
    this.removeMutedMember(channel, user);
  }, 60 * 1000); // 1 minute, change to 120000 for 2 minutes
}

private removeMutedMember(channel: Channel, user: User) {
  const index = channel.mutedMembers.findIndex((mutedUser) => mutedUser.id === user.id);

  if (index >= 0) {
    channel.mutedMembers.splice(index, 1);
    this.channelRepository.save(channel);
  }
}

async createDm(username1: string, username2: string) {
 const user1 =  await this.userService.findOneByName(username1);
 if (!user1)
  return;
 const user2 =  await this.userService.findOneByName(username2);
 if (!user2)
  return;
  // async createDmChat(user1: number, user2: number) {
  const dm = await this.findOneDm(user1.id, user2.id);
  if (dm){
  console.log("dm was found")
  return dm;
  }
    console.log("after dm found")
  const channelDto: CreateChannelDto = {
    name: `${user1.username}_${user2.username}`,
    dm: true,
    members: [user1, user2],
    owner: user1,
    accessType: `private`,
  };
  
  const newChannel = await this.create(channelDto);
  
  return newChannel;
}
  async findOneDm(user1Id: number, user2Id: number): Promise<Channel | undefined> {
    const privateChannels = await this.channelRepository.createQueryBuilder('channel')
      .innerJoin('channel.members', 'members')
      .groupBy('channel.id')
      .having('COUNT(members.id) = :count', { count: 2 })
      .andHaving('MAX(members.id) = :user1Id', { user1Id })
      .andHaving('MIN(members.id) = :user2Id', { user2Id })
      .andWhere('channel.dm = :dm', { dm: true })
      .getMany();
  

      const dm = privateChannels.find(channel => {
        for (let k = 0; k < channel.members.length; k++) {
          if (channel.members[k].id === user1Id) {
            for (let j = 0; j < channel.members.length; j++) {
              if (channel.members[j].id === user2Id && j !== k) {
                return true;
              }
            }
          }
        }
        return false;
      });
    
      return dm;
    }

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }


}