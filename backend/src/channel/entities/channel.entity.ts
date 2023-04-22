import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    // @Column({ unique: true })
    @Column({ unique: true, nullable: false })
    name: string;

    @Column({ nullable: true })
    password: string;

    @Column({default: false})
    dm: boolean;

    @OneToMany(() => Message, message => message.channel)
    messages: Message[];
  
    @ManyToMany(() => User, user => user.channels)
    @JoinTable()
    members: User[];

    @ManyToMany(() => User, user => user.invitedChannels)
    @JoinTable()
    invitedUsers: User[];
  

    @ManyToMany(() => User, user => user.adminChannels)
    @JoinTable()
    admins: User[];
    
    async getMembers(): Promise<User[]> {
      return this.members;
    }

    async getInvitedUsers(): Promise<User[]> {
        return this.invitedUsers;
      }

      async getAdmins(): Promise<User[]> {
        return this.admins;
      }
}
