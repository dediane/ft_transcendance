import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { FriendRequest } from 'src/friend/entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
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

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findByUsername(username: string) : Promise<any | undefined> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user')
    .where('user.username = :username', { username})
    .getOne()
    const {wins, losses, id} = user;
    return {wins, losses, username, id};
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

  async findOnebyId(id : number) : Promise<User | undefined> {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user')
    .where('user.id = :id', {id})
    .getOne();
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

//   async addFriend(user_id: number, friend_id: number) : Promise<User | undefined> {
//     const user = await this.userRepository.findOne({
//       where: { id: user_id },
//       relations: ['friends'],
//     });
//     const friend = await this.findOnebyId(friend_id);
//     if(!user.friends) {
//       user.friends = []
//     }
//     user.friends.push(friend)
//     const result = await this.userRepository.save(user);
//     return;
    
//  }
  async addFriend(user_id: any, friend_id: any) : Promise<FriendRequest> {
    const sender = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .where('user.id = :id', { id: user_id })
      .getOne();

    const receiver = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .where('user.id = :id', { id: friend_id })
      .getOne();
    
    const friendRequest = new FriendRequest();
    friendRequest.sender = sender;
    friendRequest.receiver = receiver;
    return this.friendRequestRepository.save(friendRequest);
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
    const user = await this.findOnebyId(userId);
    user.is2fa = true;
    await this.userRepository.update(userId, user);
  }

  async turnOffTwoFactorAuthentication(userId: number) {
    const user = await this.findOnebyId(userId);
    user.is2fa = false;
    await this.userRepository.update(userId, user);
  }


  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    const user = await this.findOnebyId(userId);
    user.secret2fa = secret;
    const result = await this.userRepository.update(userId, user);
    console.log("reSULT", result)
  }

  async updateAvatar(userId: number, avatar: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    user.avatar = avatar;
    return await this.userRepository.save(user)
  }
}
