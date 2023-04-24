import { User } from "src/user/entities/user.entity";

export class CreateChannelDto {
    name: string;
    owner?: User;
    password?: string;
    dm?: boolean;
    members?: User[];
    invitedUsers?: User[];
    admins?: User[];
    // blockedUsers?: User[];
    // mutedUsers?: User[];
  }
  