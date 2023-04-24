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
  
  // async findAll(): Promise<Channel[]> {
  //   return this.channelRepository.find();
  // }

  // async findAll() {
  //   const channels = await this.channelRepository.find({
  //     relations: ['messages', 'members', 'invitedUsers', 'admins']
  //   });
  //   return channels;
  // }
  
  async findAll() {
    const channels = await this.channelRepository
      .createQueryBuilder('channel')
      .leftJoinAndSelect('channel.members', 'member')
      .leftJoinAndSelect('channel.invitedUsers', 'invitedUser')
      .leftJoinAndSelect('channel.admins', 'admin')
      .select(['channel.name', 'channel.name', 'member.username', 'invitedUser.username', 'admin.username'])
      .leftJoinAndSelect('channel.messages', 'message')
      .select(['channel.name', 'channel.password','message.content'])
      // .select(['channel.name', 'channel.dm', 'channel.password', 'message.content', 'member.username', 'invitedUser.username', 'admin.username'])
      .getMany();
    return channels;
  }
  
  
  // async findOne(id: number): Promise<Channel> {
  //   return this.channelRepository.findOne({ where: { id } });
  // }

  // async findOne(id : number) : Promise<Channel | undefined> {
  //   const channel = await this.channelRepository
  //   .createQueryBuilder('channel')
  //   .select('channel')
  //   .where('channel.id = :id', {id})
  //   .getOne();

  //   return channel;
  // }

  async findOne(id: number): Promise<Channel | undefined> {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      // .leftJoinAndSelect('channel.password', 'password')
      .leftJoinAndSelect('channel.messages', 'message')
      .leftJoinAndSelect('channel.members', 'member')
      .leftJoinAndSelect('channel.invitedUsers', 'invitedUser')
      .leftJoinAndSelect('channel.admins', 'admin')
      .where('channel.id = :id', { id })
      .getOne();
    return channel;
  }

  // async getChannelAdmins(id: number) {
  //   const channel = await this.channelRepository.findOne(id);
  //   return channel.admins;
  // }

  

  //PAR ID POUR QUAND PAR USER CHANS POUR EVITER DOUBLONS PRIVATE/PROTECTED
  // async getChannelPassword(id: number) { 
	// 	const channel = await this.channelRepository.createQueryBuilder('channel')
	// 		.select('channel.password')
  //     .select('channel')
	// 		.where('channel.id = :id', { id })
	// 		.getOne();

	// 	return channel.password;
	// }
  
  
  async findOneByName(name: string): Promise<Channel | undefined> {
    const channel = await this.channelRepository
      .createQueryBuilder('channel')
      .select('channel')
      .where('channel.name = :name', { name })
      .getOne();
  
    return channel;
  }
  

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
  
  
  // async findOne(id: number): Promise<Channel | undefined> {
  //   const channel = await this.channelRepository.findOne(id);
  //   if (channel) {
  //     const messages = await this.messageService.findAllByChannelId(channel.id);
  //     channel.message = messages;
  //   }
  //   return channel;
  // }

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

async displayMembers(channel: Channel) {
  const memberNames = channel.members.map(member => member.username);
  console.log(`Members of ${channel.name}: ${memberNames.join(', ')}`);
  }


async addMember(channel: Channel, userId: number) {
  const user = await this.userService.findOnebyId(userId);

  // Check if user is already in the channel's members list
  const isUserInMembersList = channel.members.some(member => member.id === user.id);

  if (!isUserInMembersList) {
    await this.channelRepository.update(channel.id, {
      members: [ ...channel.members, user]
    });
  }

  return user;
}


async inviteUser(channel: Channel, userId: number) {
  const user = await this.userService.findOnebyId(userId);

  // Check if user is already in the channel's members list
  const isUserinInvitedList = channel.invitedUsers.some(invitedUser => invitedUser.id === user.id);

  if (!isUserinInvitedList) {
    await this.channelRepository.update(channel.id, {
      invitedUsers: [ ...channel.invitedUsers, user]
    });
  }

  return user;
}

//userid who asked for it, channel id what chan and adminId = admintoadd
async addAdmin(userId: string, channelId: number, adminId: number): Promise<boolean> {
  // Check if user is the owner of the channel
  const channel = await this.channelRepository.createQueryBuilder('channel')
  .leftJoin('channel.owner', 'owner')
  .where('channel.id = :channelId', { channelId })
  .andWhere('owner.id = :userId', { userId })
  .getOne();
  
  if (!channel) {
  throw new Error('Channel not found or user is not the owner');
  }
  
  // Check if user is already an admin of the channel
  const isAdmin = channel.admins.some(admin => admin.id === adminId);
  if (isAdmin) {
  throw new Error('User is already an admin of the channel');
  }
  
  // Add the admin to the channel's admin list
  const newadmin = await this.userService.findOnebyId(adminId);
  if (!newadmin) {
  throw new Error('User to add to admin list was not found');
  }
  await this.channelRepository.update(channel.id, {
    admins: [...channel.admins, newadmin],
  });
  
  return true;
  }

async removeAdmin(channel: Channel, userId: number) {
  const isAdmin = channel.admins.some(admin => admin.id === userId);
  const isOwner = channel.owner.id === userId;

  if (!isAdmin) {
    throw new Error('User is not an admin');
  }

  const user = await this.userService.findOnebyId(userId);
  const filteredAdmins = channel.admins.filter(admin => admin.id !== userId);

  let newOwner;
  if (isOwner) {
    if (filteredAdmins.length === 0) {
      // If the owner is the only admin, make the first member the new owner
      newOwner = channel.members[0];
    } else {
      // Otherwise, the first remaining admin becomes the new owner
      newOwner = filteredAdmins[0];
    }
  }

  await this.channelRepository.update(channel.id, {
    admins: filteredAdmins,
    owner: isOwner ? newOwner : channel.owner,
    members: channel.members.filter(member => member.id !== userId),
  });

  return user;
}

async removeUser(channel: Channel, userId: number) {
  try {
    await this.removeAdmin(channel, userId);
  } catch (e) {}

  const user = await this.userService.findOnebyId(userId);
  const userRemovedList = channel.members.filter((chanUser) => {
    return chanUser.id !== user.id;
  });

  const userInvitedRemovedList = channel.invitedUsers.filter((invitedUser) => {
    return invitedUser.id !== user.id;
  });

  await this.channelRepository.update(channel.id, {
    members: userRemovedList,
    invitedUsers: userInvitedRemovedList,
  });
  return user;
}

  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }
}

