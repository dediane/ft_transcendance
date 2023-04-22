import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Channel } from 'src/channel/entities/channel.entity';

@Injectable()
export class UserService {
  static findAll() {
      throw new Error("Method not implemented.");
  }
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const newUser = await this.userRepository.create({...createUserDto, password: hashedPassword, });
    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      return({status: false, error: error.driverError.detail});
    }
    return {status: true};
  }

  // async findAll() {
  //   const users = await this.userRepository.find();
  //   return users;
  // }
  
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.channels', 'channel')
      // .leftJoinAndSelect('user.invitedChannels', 'invitedChannel')
      // .leftJoinAndSelect('user.adminChannels', 'adminChannel')
      // .leftJoinAndSelect('channel.messages', 'message')
      .select(['user.username', 'channel.name'])
      // .select(['user.id', 'user.username', 'message.id', 'channel.name', 'invitedChannel.name', 'adminChannel.name'])
      .getMany();
  
    return users;
  }
  
  
  async findOne(email: string) : Promise<User | undefined> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user')
    .where('user.email = :email', { email })
    .getOne()
    return user;
  }
  
  async findOnebyId(id : number) : Promise<User | undefined> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user')
    .where('user.id = :id', {id})
    .getOne();
    return user;
  }
  // async findAll() {
  //   // const users = await this.userRepository.find();

  //   const users = await this.userRepository.find({
  //     // relations: ['id', 'username', 'message', 'channels', 'invitedChannels', 'adminChannels']
  //     relations: ['message', 'channels', 'invitedChannels', 'adminChannels']
  //   });
  //   return users;
  // }

  // async findOnebyId(id: number): Promise<User | undefined> {
  //   const user = await this.userRepository
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.channels', 'channel')
  //     .leftJoinAndSelect('user.invitedChannels', 'invitedChannel')
  //     .leftJoinAndSelect('user.adminChannels', 'adminChannel')
  //     .where('user.id = :id', { id })
  //     .getOne();
  //   return user;
  // }




  // async findOnebyId(id : number) : Promise<User | undefined> {
  //   const user = await this.userRepository
  //   .createQueryBuilder('user')
  //   .select('user')
  //   .where('user.id = :id', {id})
  //   .getOne();
  //   return user;
  // }




  async findOneChannelByName(userId: number, channelName: string): Promise<Channel | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['channels']
    });
    if (!user) {
      throw new Error('User not found');
    }
    const channel = user.channels.find(channel => channel.name === channelName);
    return channel;
  }
  

  async findOneBySocketId(socketId: string): Promise<User | undefined> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .where(':socketId = ANY(user.socketids)', { socketId })
      .getOne();
    return user;
  }
  

  async addSocketId(userId: number, socketId: string): Promise<User> {
    const user = await this.findOnebyId(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    user.socketids = user.socketids ? [...user.socketids, socketId] : [socketId];
    return this.userRepository.save(user);
  }

  async removeSocketId(userId: number, socketId: string): Promise<User> {
    const user = await this.findOnebyId(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    user.socketids = user.socketids?.filter(id => id !== socketId);
    return this.userRepository.save(user);
  }
  

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  } 
  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  
}
