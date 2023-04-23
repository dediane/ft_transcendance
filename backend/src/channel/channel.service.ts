import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Message } from 'src/message/entities/message.entity';

@Injectable()
export class ChannelService {
  static findAll() {
    throw new Error("Method not implemented.");
}
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
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
      .select(['channel.name', 'member.username', 'invitedUser.username', 'admin.username'])
      .leftJoinAndSelect('channel.messages', 'message')
      .select(['channel.name', 'message.content'])
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
      .leftJoinAndSelect('channel.messages', 'message')
      .leftJoinAndSelect('channel.members', 'member')
      .leftJoinAndSelect('channel.invitedUsers', 'invitedUser')
      .leftJoinAndSelect('channel.admins', 'admin')
      .where('channel.id = :id', { id })
      .getOne();
    return channel;
  }
  
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


  async remove(id: number): Promise<void> {
    await this.channelRepository.delete(id);
  }
}

