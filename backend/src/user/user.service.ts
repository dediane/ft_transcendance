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
    await this.userRepository.save(newUser);
    return newUser;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findPassword(email: string): Promise<User> | null {
    const user = await this.userRepository
    .createQueryBuilder('user')
    .select('user.password')
    .where('user.email = :email', { email })
    .getOne()
    return user;
  }

}
