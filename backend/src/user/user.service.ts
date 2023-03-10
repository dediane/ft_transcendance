import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  async findAll() {
    const users = await this.userRepository.find();
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
