import { User } from "src/user/entities/user.entity";
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import {  Type } from 'class-transformer';
export class CreateChannelDto {
    name: string;
    owner?: User;
    password?: string;

    dm?: boolean;
    
    @IsArray()
    @Type(() => User)
    members?: User[];

    invitedUsers?: User[];
    admins?: User[];

//to be able to iterate over an array of users

    // blockedUsers?: User[];
    // mutedUsers?: User[];
  }
  