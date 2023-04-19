import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
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

  async findAll() {
    const users = await this.userRepository.find();
    return users;
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
    return;
    
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
