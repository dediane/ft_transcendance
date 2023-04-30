import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { Game } from 'src/game/entities/game.entity';
import { Message } from 'src/message/entities/message.entity';
import { Channel } from 'src/channel/entities/channel.entity';


// @Entity()
// export class ChannelMembership {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => Channel, channel => channel.users)
//   channel: Channel;

//   @ManyToOne(() => User, user => user.memberships)
//   user: User;

//   @Column()
//   role: string;
// }


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, unique: true })
  login42: string;

  @Column({ unique: true })
  email: string;

  // @Column({ nullable: true})
  // socketid: string;
  @Column({ type: 'simple-array', nullable: true })
  socketids: string[];
  
  @Column({ nullable: true })
  avatar: string;

  @Column()
  password: string;

  @Column({default: 0})
  wins: number;

  @Column({default: 0})
  losses: number;

  @OneToMany(() => Game, (game) => game.player1)
  gamePlayer1: Game[];

  @OneToMany(() => Game, (game) => game.player2)
  gamePlayer2: Game[];

  @OneToMany(() => Message, (message) => message.sender)
@JoinColumn()
messages: Message[];


@ManyToMany(() => Channel, channels => channels.admins)
adminChannels: Channel[];

@ManyToMany(() => Channel, channels => channels.members)
channels: Channel[];


@ManyToMany(() => Channel, channels => channels.mutedMembers)
ismuted: Channel[];

@ManyToMany(() => Channel, channels => channels.bannedUsers)
isbanned: Channel[];

@OneToMany(() => Channel, channel => channel.owner)
ownedChannels: Channel[];

// @ManyToMany(() => User, user => user.blockedUsers)
// blockedUsers: User[];

@ManyToMany(() => User, user => user.blockedUsers)
@JoinTable()
blockedBy: User[];

@ManyToMany(() => User, user => user.blockedBy)
blockedUsers: User[];

  async getChannels(): Promise<Channel[]> {
    return this.channels;
  }

}