import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }

  async findAll(): Promise<Message[]> {
    return this.messageRepository.find();
  }

  async getMessagesPayload(): Promise<{ content: string, chatName: string, sender: string }[]> {
    const messages = await this.messageRepository.find({
      relations: ['sender', 'channel'],
    });
  
    return messages.map(message => {
      const { content, sender, channel } = message;
      return {
        content,
        chatName: channel.name,
        sender: sender.username,
      };
    });
  }

  // async getMessagesPayloadperChan(channelName: string): Promise<Message[]> {
  //   const channel = await this.channelRepository.findOne({ name: channelName });
  //   if (!channel) {
  //     throw new NotFoundException(`Channel '${channelName}' not found`);
  //   }
  
  //   const messages = await this.messageRepository.find({ channel });
  
  //   const payload = messages.map((message) => ({
  //     content: message.content,
  //     chatName: channelName,
  //     sender: message.sender,
  //   }));
  
  //   return payload;
  // }
  
  // async getMessagesPayloadperChan(channelName: string): Promise<{ content: string, chatName: string, sender: string }[]> {
  //   const channel = await this.channelRepository.findOne({ name: channelName });
  //   if (!channel) {
  //     throw new NotFoundException(`Channel '${channelName}' not found`);
  //   }
  
  //   const messages = await this.messageRepository.find({ where: { channel } });
  //   const payload = messages.map((message) => ({
  //     content: message.content,
  //     chatName: channel.name,
  //     sender: message.sender.username,
  //   }));
  
  //   return payload;
  // }
  
  
  
  // async getMessagesForChannel(channelId: number): Promise<Message[]> {
  //   const messages = await this.messageRepository.find({
  //     where: {
  //       channel: { id: channelId },
  //     },
  //     relations: ['sender', 'channel'],
  //   });
  //   return messages;
  // }
  
  // async getMessagesForChannelbyName(channelName: string): Promise<Message[]> {
  //   const channel = await this.channelRepository.findOne({
  //     where: { name: channelName },
  //     relations: ['messages', 'messages.sender', 'messages.channel'],
  //   });
  //   if (!channel) {
  //     throw new Error(`Channel ${channelName} not found`);
  //   }
  //   return channel.messages;
  // }
  
  
  
  
  async findOne(id : number) : Promise<Message | undefined> {
    const Message = await this.messageRepository
    .createQueryBuilder('Message')
    .select('Message')
    .where('Message.id = :id', {id})
    .getOne();

    return Message;
  }
  

  async update(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
    const message = await this.messageRepository.findOne({where: {id}});
    if (!message) {
      throw new Error(`Message with ID ${id} not found`);
    }
    Object.assign(message, updateMessageDto);
    return this.messageRepository.save(message);
  }

  async remove(id: number): Promise<void> {
    await this.messageRepository.delete(id);
  }
}
