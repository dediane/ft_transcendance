import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FriendRequest } from 'src/friend/entities/friend.entity';
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
    @InjectRepository(FriendRequest) private friendRequestRepository: Repository<FriendRequest>,
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

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.channels', 'memberOfChannel')
      .leftJoinAndSelect('user.ownedChannels', 'ownerOfChannel')
      .leftJoinAndSelect('user.adminChannels', 'adminOfChannel')
      .leftJoinAndSelect('user.blockedUsers', 'blockedUser')
        .select(['user.username', 'user.is2fa', 'user.secret2fa', 'memberOfChannel.name', 'adminOfChannel.name', 'ownerOfChannel.name', 'blockedUser.username', 'user.wins','user.losses'])
      .getMany();
  
    return users;
  }

  async getAvatar(username: string): Promise<string | undefined> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user.avatar', 'avatar')
      .where('user.username = :username', { username })
      .getOne();
    
    return user?.avatar;
  }

  async findAndUpdateUserByUsername(username: string, newusername: string): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: newusername })
      .getOne();

    if (user) {
      return false;
    }
    const myuser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();

    await this.userRepository.update( myuser.id, {username: newusername});
    return true;
  }

  // async updateUsername(username: string): Promise<string | undefined> {
  //   .createQueryBuilder('user')
  //   .select('user.username = :username', { username})
    
  // }
  
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

  async findByUsername(username: string) : Promise<any | undefined> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user')
    .where('user.username = :username', { username})
    .getOne()
    const {wins, losses, id, avatar} = user;
    return {wins, losses, username, id, avatar};
  }

  async search(params: string) {
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
    .where('user.email = :email', { email})
    .getOne()
    return user;
  }

  async findOnebyId2(id : number) : Promise<User | undefined> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user')
    .where('user.id = :id', {id})
    .getOne();
    delete user.password
    return user;
  }
  async removeFriendRequest(sender_id: any, receiver_id: any): Promise<void> {
    const friendRequest = await this.findFriendRequest(sender_id, receiver_id);
    if (friendRequest) {
      await this.friendRequestRepository.remove(friendRequest);
    } else {
      throw new Error('Friend request not found');
    }
  }

  async sendFriendRequest(user_id: number, friend_id: number) {
    const sender = await this.findOnebyId(user_id);
    const receiver = await this.findOnebyId(friend_id);
    
    const friendRequest = new FriendRequest();
    friendRequest.sender = sender;
    friendRequest.receiver = receiver;
  
    await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(FriendRequest)
      .values(friendRequest)
      .execute();
  }

  async rejectFriendRequest(friendRequestId: number) {
    await this.userRepository
      .createQueryBuilder()
      .update(FriendRequest)
      .set({ status: 'REJECTED' })
      .where("id = :id", { id: friendRequestId })
      .execute();
  }
  
  async getFriendRequests(user_id: number) {
    return this.userRepository
      .createQueryBuilder('friendRequest')
      .select('friendRequest')
      .where("friendRequest.receiverId = :id AND friendRequest.status = :status", { id: user_id, status: 'PENDING' })
      .getMany();
  }
  
  async getFriends(user_id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .where("user.id = :id", { id: user_id })
      .leftJoinAndSelect('user.friends', 'friend')
      .getOne();
    
    return user.friends;
  }

async update(id: number, updateUserDto: UpdateUserDto) {
  console.log("passe par userservice update")
  return `This action updates a #${id} user`;
} 

    async addFriend(user_id: number, friend_id: number) : Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['friends'],
    });
    const friend = await this.findOnebyId(friend_id);
    if(!user.friends) {
      user.friends = []
    }
    user.friends.push(friend)
    const result = await this.userRepository.save(user);
    return friend;
 }

  async acceptFriendRequest(request_id: number) : Promise<User> {
    const request = await this.friendRequestRepository.findOne({ where: { id: request_id }, relations: ['sender', 'receiver'] });

    if (!request) {
      throw new Error('Request not found');
    }
  
    request.sender.friends.push(request.receiver);
    request.receiver.friends.push(request.sender);
  
    await this.userRepository.save([request.sender, request.receiver]);
    await this.friendRequestRepository.delete(request_id);
  
    return request.receiver;
  }

  async findFriendRequest(sender_id: any, receiver_id: any): Promise<FriendRequest | undefined> {
    return await this.friendRequestRepository.findOne({ where: { sender: sender_id, receiver: receiver_id } });
  }
  
  async unblockUser(blockerUserId: number, blockeeUsername: string): Promise<void> {
    console.log("unblock user SERVICE")
    const blocker = await this.userRepository.findOne({
      where: { id: blockerUserId },
      relations: ['blockedUsers'],
    });
  
    if (!blocker) {
      throw new Error(`User with id ${blockerUserId} not found`);
    }
    const blockee = await this.userRepository.findOne({
      where: { username: blockeeUsername },
    });
    if (!blockee) {
      throw new Error(`User with username ${blockeeUsername} not found`);
    }
    blocker.blockedUsers = blocker.blockedUsers.filter(user => user.id !== blockee.id);
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
    return user.blockedUsers;
  }

  async findOneByName(username: string) {

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
      'user.wins',
      'user.losses',
      'memberOfChannel.name',
      'adminOfChannel.name',
      'isbannedOfChannel.name',
      'ownerOfChannel.name',
      'blockedUser.username'
    ])
    .where('user.username = :username', { username })

    .getOne();
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
        'user.is2fa',
        'user.secret2fa',
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
  
    async removeFriend(user_id: number, friend_id: number) {
    const user = await this.userRepository.findOne({
      where: { id: user_id },
      relations: ['friends'],
    });
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

  async turnOnTwoFactorAuthentication(userId: number) {
    const user = await this.findOnebyId2(userId);
    user.is2fa = true;
    await this.userRepository.update(userId, user);
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    const user = await this.findOnebyId2(userId);
    user.is2fa = false;
    await this.userRepository.update(userId, user);
  }


  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    console.log("THIS USERID", userId)
    const user = await this.findOnebyId2(userId);
    user.secret2fa = secret;
    console.log("THIS USER IN DATABASE", user)

    const result = await this.userRepository.update(userId, user);
    // console.log("reSULT", result)
  }

  async updateAvatar(userId: number, avatar: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    user.avatar = avatar;
    return await this.userRepository.save(user)
  }
  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
  
}