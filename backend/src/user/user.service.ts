import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Channel } from 'src/channel/entities/channel.entity';
import { UpdateChannelDto } from 'src/channel/dto/update-channel.dto';

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
  // async findAll(): Promise<User[]> {
  //   const users = await this.userRepository.createQueryBuilder('user')
  //     .leftJoinAndSelect('user.channels', 'memberOfChannel')
  //     .leftJoinAndSelect('user.ownedChannels', 'ownerOfChannel')
  //     .leftJoinAndSelect('user.adminChannels', 'adminOfChannel')
  //     .select(['user.username', 'memberOfChannel.name',  'adminOfChannel.name',  'ownerOfChannel.name'])
  //     .getMany();
  
  //   return users;
  // }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.channels', 'memberOfChannel')
      .leftJoinAndSelect('user.ownedChannels', 'ownerOfChannel')
      .leftJoinAndSelect('user.adminChannels', 'adminOfChannel')
      .leftJoinAndSelect('user.blockedUsers', 'blockedUser')
      .select(['user.email','user.username', 'user.password', 'memberOfChannel.name', 'adminOfChannel.name', 'ownerOfChannel.name', 'blockedUser.username', 'user.wins','user.losses'])
      .getMany();
  
    return users;
  }
  
  async blockUser(blockerUserId: number, blockeeUsername: string): Promise<void> {
    // Find the user who is blocking
    const blocker = await this.userRepository.findOne({
      where: { id: blockerUserId },
      relations: ['blockedUsers'],
    });
  
    if (!blocker) {
      throw new Error(`User with id ${blockerUserId} not found`);
    }
  
    // Find the user who is being blocked
    const blockee = await this.userRepository.findOne({
      where: { username: blockeeUsername },
    });
  
    if (!blockee) {
      throw new Error(`User with username ${blockeeUsername} not found`);
    }
  
    // Add the blockee to the blocker's list of blocked users
    blocker.blockedUsers.push(blockee);
  
    // Save the blocker to the database
    await this.userRepository.save(blocker);
  }
  
  async unblockUser(blockerUserId: number, blockeeUsername: string): Promise<void> {
    // Find the user who is blocking
    console.log("unblock user SERVICE")
    const blocker = await this.userRepository.findOne({
      where: { id: blockerUserId },
      relations: ['blockedUsers'],
    });
  
    if (!blocker) {
      throw new Error(`User with id ${blockerUserId} not found`);
    }
  
    // Find the user who is being blocked
    const blockee = await this.userRepository.findOne({
      where: { username: blockeeUsername },
    });
  
    if (!blockee) {
      throw new Error(`User with username ${blockeeUsername} not found`);
    }
  
    // Remove the blockee from the blocker's list of blocked users
    blocker.blockedUsers = blocker.blockedUsers.filter(user => user.id !== blockee.id);
  
    // Save the blocker to the database
    await this.userRepository.save(blocker);
  }
  
  async getBlockedUsers(userId: number): Promise<User[]> {
    // Find the user who is blocking
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['blockedUsers'],
    });
  
    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }
  
    // Return the list of blocked users
    return user.blockedUsers;
  }
  
  

  // async findAll(): Promise<User[]> {
  //   const users = await this.userRepository.createQueryBuilder('user')
  //     .leftJoinAndSelect('user.channels', 'memberOfChannel')
  //     .leftJoinAndSelect('user.ownedChannels', 'ownerOfChannel')
  //     .leftJoinAndSelect('user.adminChannels', 'adminOfChannel')
  //     .leftJoinAndSelect('user.blockedUsers', 'blockedUser')
  //     .select(['user.username', 'memberOfChannel.name', 'adminOfChannel.name', 'ownerOfChannel.name', 'blockedUser.username'])
  //     .getMany();
  
  //   return users;
  // }
  
  
  // async findOneByName(username: string): Promise<User> {
  //   const user = await this.userRepository
  //     .createQueryBuilder('user')
  //     .select('user')
  //     .where('user.username = :username', { username })
  //     .getOne();
  
  //   if (!user) {
  //     throw new Error(`User with username ${username} not found.`);
  //   }
  
  //   return user;
  // }

  // async findOneByName(username: string): Promise<User> {
  //   const user = await this.userRepository
  //     .createQueryBuilder('user')
  //     .leftJoin('user.blockedUsers', 'blockedUsers')
  //     .select(['user', 'blockedUsers.username'])
  //     .where('user.username = :username', { username })
  //     .getOne();
  
  //   if (!user) {
  //     throw new Error(`User with username ${username} not found.`);
  //   }
  
  //   return user;
  // }

  async findOneByName(username: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.blockedUsers', 'blockedUsers')
      .select(['user.username', 'user.wins', 'user.losses'])
      // .addSelect('blockedUsers')
      .where('user.username = :username', { username })
      .getOne();
  
    if (!user) {
      throw new Error(`User with username ${username} not found.`);
    }
  
    return user;
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
  async findBlockedUsers(userId: number): Promise<User[]> {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.blockedUsers", "blockedUser")
      .where("user.id = :id", { id: userId })
      .getOne();
  
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }
  
    return user.blockedUsers;
  }
  
  
  // async findOnebyId(id : number): Promise<User | undefined> {
  //   const user = await this.userRepository
  //     .createQueryBuilder('user')
  //     .leftJoinAndSelect('user.blockedUsers', 'blockedUsers')
  //     .select('user')
  //     .addSelect('blockedUsers')
  //     .where('user.id = :id', { id })
  //     .getOne();
  
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

  async update(id: number, updateUserDto: UpdateUserDto) {
    console.log("passe par userservice update")
    return `This action updates a #${id} user`;
  } 
  

  async remove(id: number) {
    await this.userRepository.delete(id)
    return `This action removes a #${id} user`;
  }
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  
}
