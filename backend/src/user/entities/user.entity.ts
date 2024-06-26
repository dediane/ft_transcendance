import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinColumn, JoinTable } from 'typeorm';
import { Game } from 'src/game/entities/game.entity';
import { Message } from 'src/message/entities/message.entity';
import { FriendRequest } from 'src/friend/entities/friend.entity';
import { Channel } from 'src/channel/entities/channel.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: true, unique: true })
  login42: string;

  @Column({default: false})
  is2fa: boolean;

  @Column({nullable: true})
  secret2fa: string;

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
  message: Message[];

  @ManyToMany(() => User, (user) => user.id)
  @JoinTable()
  friends: User[];
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

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

}