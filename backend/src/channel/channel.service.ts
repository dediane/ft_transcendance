import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Message } from 'src/message/entities/message.entity';
// import { User } from 'src/user/entities/user.entity';
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
    // private readonly channelService: ChannelService,
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
      // .leftJoinAndSelect('channel.invitedUsers', 'invitedUser')
      .leftJoinAndSelect('channel.admins', 'admin')
      // .select(['channel.name', 'channel.id', 'member.username', 'admin.username'])
      .leftJoinAndSelect('channel.messages', 'message')
      .select(['channel.name', 'channel.id', 'owner.username', 'channel.password', 'member.username', 'admin.username', 'message.content'])
      // .select(['channel.name', 'channel.dm', 'channel.password', 'message.content', 'member.username', 'invitedUser.username', 'admin.username'])
      .getMany();
    return channels;
  }
  
  async findOne(id: number): Promise<Channel | undefined> {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      // .leftJoinAndSelect('channel.password', 'password')
      .leftJoinAndSelect('channel.messages', 'message')
      .leftJoinAndSelect('channel.members', 'member')
      // .leftJoinAndSelect('channel.invitedUsers', 'invitedUser')
      .leftJoinAndSelect('channel.admins', 'admin')
      .where('channel.id = :id', { id })
      .getOne();
    return channel;
  }

  async findOneByName(name: string): Promise<Channel | undefined> {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.members', 'members')
      .where('channel.name = :name', { name })
      .leftJoinAndSelect('channel.admins', 'admins')
      .select(['channel.id', 'channel.name', 'members', 'admins'])
      .getOne();
  
    return channel;
  }
  
  // //Cannot query across many-to-many for property users
  // async findOneByName(name: string): Promise<Channel | undefined> {
  //   const channel = await this.channelRepository
  //     .createQueryBuilder('channel')
  //     .leftJoinAndSelect('channel.members', 'members')
  //     .where('channel.name = :name', { name })
  //     // .leftJoinAndSelect('channel.id', 'id')
  //     // .select(['channel.name', 'members.username'])
  //     .select(['channel.id', 'channel.name', 'members.username'])
  //     .getOne();
  //     // .getMany();
  
  //   return channel;
  // }
  
 
  

  async findMessagesByChatname(chatname: string): Promise<{ content: string, chatName: string, sender: string }[]> {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.channel', 'channel')
      .leftJoin('message.sender', 'sender')
      .select(['message.content', 'channel.name', 'sender.username'])
      .where('channel.name = :chatname', { chatname })
      .getMany();
  
    return messages.map(message => {
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

async isChannelPasswordCorrect(channelName: string, userInput: string): Promise<boolean> {
  const channelPassword = await this.getChannelPassword(channelName);
  return channelPassword === userInput;
} //if returns bool=true then addMember function is called. <= do so in socket.ts


async getChannelPassword(name: string) { 
  const channel = await this.channelRepository.createQueryBuilder('channel')
    .select('channel.password')
    .where('channel.name = :name', { name })
    // .where('channel.id = :id', { id })
    .getOne();

  return channel.password;
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
  });

  return true;
}

async addMember(channelName: string, adminId: number, username: string) : Promise<Channel | undefined> 
{
  const channel = await this.findOneByName(channelName);
  // const admin = await this.userService.findOnebyId(adminId);

  // // Check if the admin is in the channel's list of admins
  // const isAdminInAdminsList = channel?.admins?.some(admin => admin.id === adminId);

  // if (!isAdminInAdminsList){
  //   throw new Error("Only admins are authorized to add members to the channel.");
  // }

  const user = await this.userService.findOneByName(username);

  if(!channel.members) {
    channel.members = []
  }
  channel.members.push(user)
  const result = await this.channelRepository.save(channel);
    return result;
  }




  async addAdmin(channelName: string, adminId: number, username: string) : Promise<Channel | undefined> 
{
   // Check if user is the owner of the channel
//   const channel = await this.channelRepository.createQueryBuilder('channel')
//   .leftJoin('channel.owner', 'owner')
//   .where('channel.id = :channelId', { channelId })
//   .andWhere('owner.id = :userId', { userId })
//   .getOne();
  
//   if (!channel) {
//   throw new Error('Channel not found or user is not the owner');
//   }
  const channel = await this.findOneByName(channelName);
  // const admin = await this.userService.findOnebyId(adminId); //byname(username)

  // // Check if the admin is in the channel's list of admins
  // const isAdminInAdminsList = channel?.admins?.some(admin => admin.id === adminId);

  // if (!isAdminInAdminsList){
  //   throw new Error("Only admins are authorized to add members to the channel.");
  // }


//   // Add the admin to the channel's admin list
  const user = await this.userService.findOneByName(username);

  if(!channel.admins) {
    channel.admins = []
  }
  channel.admins.push(user)
  const result = await this.channelRepository.save(channel);
    return result;

    
  }

  // async removeFriend(user_id: number, friend_id: number) {
  //   const user = await this.userRepository.findOne({
  //     where: { id: user_id },
  //     relations: ['friends'],
  //   });
  //   console.log("USER", user)
  //   if(user.friends) {
  //     for (var k = 0; k < user.friends.length; k++)
  //     {
  //       if (user.friends[k].id === friend_id)
  //         user.friends.splice(k, 1)
  //     }
  //     await this.userRepository.save(user);
  //   }
  //   return;
  // }

// async removeAdmin(channel: Channel, userId: number) {
  async removeAdmin(channelName: string, adminId: number, username: string){
  const channel = await this.findOneByName(channelName);

  // const isAdmin = channel.admins.some(admin => admin.id === userId);
  // const isOwner = channel.owner.id === userId;

  // if (!isAdmin) {
  //   throw new Error('User is not an admin');
  // }

  // const user = await this.userService.findOnebyId(userId);
  if(channel.admins) {
    for (var k = 0; k < channel.admins.length; k++)
    {
      if (channel.admins[k].username === username)
      channel.admins.splice(k, 1)
    }
    await this.channelRepository.save(channel);
  }
  // const filteredAdmins = channel.admins.filter(admin => admin.username !== username);

  // let newOwner;
  // if (isOwner) {
  //   if (filteredAdmins.length === 0) {
  //     // If the owner is the only admin, make the first member the new owner
  //     newOwner = channel.members[0];
  //   } else {
  //     // Otherwise, the first remaining admin becomes the new owner
  //     newOwner = filteredAdmins[0];
  //   }
  // }

  // await this.channelRepository.update(channel.id, {
  //   admins: filteredAdmins,
    // owner: isOwner ? newOwner : channel.owner,
    // members: channel.members.filter(member => member.id !== userId),
  // });

  // return user;
}

async removeMember(channelName: string, adminId: number, username: string){

  console.log("REMOVE MEMBER CALLED SERVICE")
  const channel = await this.findOneByName(channelName);

  if(channel.members) {
    for (var k = 0; k < channel.members.length; k++)
    {
      if (channel.members[k].username === username)
      channel.members.splice(k, 1)
    }
    await this.channelRepository.save(channel);
  }

  // const admin = await this.userService.findOnebyId(adminId);

  // // Check if the admin is in the channel's list of admins
  // const isAdmin = channel.admins.some(admin => admin.id === userId);
  // if (!isAdmin){
  //   throw new Error("Only admins are authorized to remove members from the channel.");
  // }

  // try {
  //   await this.removeAdmin(channel, userId);
  // } catch (e) {}

  // const user = await this.userService.findOnebyId(userId);
  // const userRemovedList = channel.members.filter((chanUser) => {
  //   return chanUser.id !== user.id;
  // });

  // await this.channelRepository.update(channel.id, {
  //   members: userRemovedList,
  // });
  // return user;
}

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }
}

