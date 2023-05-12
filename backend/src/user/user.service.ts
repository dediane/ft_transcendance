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
      .select(['user.username', 'memberOfChannel.name', 'adminOfChannel.name', 'ownerOfChannel.name', 'blockedUser.username'])
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

  async findOneByName(username: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      // .leftJoinAndSelect('user.blockedUsers', 'blockedUsers')
      .select('user')
      // .addSelect('blockedUsers')
      .where('user.username = :username', { username })
      .getOne();
  
    if (!user)
      return ;
    // {
    //   throw new Error(`User with username ${username} not found.`);
    // }
  
    return user;
  }
  
  

  async search(params: string) {
    console.log(params)
    const users = await this.userRepository
    .createQueryBuilder('user')
    .select(['user.username', 'user.id', 'user.avatar'])
    .where("user.username like :username", { username:`%${params}%` })
    .getMany();
    return users;
  }

  async findOnebyEmail(email: string) : Promise<User | undefined> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user')
    .where('user.email = :email', { email })
    .getOne()
    return user;
  }
  
  async findOnebyId(id: number): Promise<User | undefined> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.channels', 'memberOfChannel')
      .leftJoinAndSelect('user.ownedChannels', 'ownerOfChannel')
      .leftJoinAndSelect('user.adminChannels', 'adminOfChannel')
      .leftJoinAndSelect('user.isbanned', 'isbannedOfChannel')
      .leftJoinAndSelect('user.blockedUsers', 'blockedUser')
      .select([
        'user.id',
        'user.username',
        // 'user.email',
        // 'user.socketids',
        // 'user.avatar',
        // 'user.password',
        // 'user.wins',
        // 'user.losses',
        'memberOfChannel.name',
        'adminOfChannel.name',
        'isbannedOfChannel.name',
        'ownerOfChannel.name',
        'blockedUser.username'
      ])
      .where('user.id = :id', { id })
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

  async addFriend(user_id: number, friend_id: number) : Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['friends'],
    });
    console.log("USER", user)
    const friend = await this.findOnebyId(friend_id);
    if(!user.friends) {
      user.friends = []
    }
    user.friends.push(friend)
    const result = await this.userRepository.save(user);
    return;
    
  }

  async removeFriend(user_id: number, friend_id: number) {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['friends'],
    });
    console.log("USER", user)
    if(user.friends) {
      for (var k = 0; k < user.friends.length; k++)
      {
        if (user.friends[k].id === friend_id)
          user.friends.splice(k, 1)
      }
      await this.userRepository.save(user);
    }
    return;
  }

  async findFriend(user_id: number) {
    return (
      await this.userRepository.findOne({
      where: {id: user_id},
      relations: ['friends'],
    })
    )
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
