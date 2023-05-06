import { User } from "src/user/entities/user.entity";
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import {  Type } from 'class-transformer';

// enum AccessType {
//     Public = 'public',
//     Protected = 'protected',
//     Private = 'private',
//   }

  
export class CreateChannelDto {
    name: string;
    owner?: User;
    password?: string;

    dm?: boolean;

    accessType?: string; 
    // accessType: ChannelAccessType[accessType as keyof typeof ChannelAccessType], // Convert the accessType to the enum value
    // accessType: AccessType;
    @IsArray()
    @Type(() => User)
    members?: User[];

    invitedUsers?: User[];
    admins?: User[];

//to be able to iterate over an array of users

    // blockedUsers?: User[];
    // mutedUsers?: User[];
  }
  