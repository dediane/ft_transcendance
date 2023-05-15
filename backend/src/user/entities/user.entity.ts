import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Game } from 'src/game/entities/game.entity';
import { Message } from 'src/message/entities/message.entity';
import { FriendRequest } from 'src/friend/entities/friend.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true, unique: true })
  login42: string;

  @Column({default: false})
  is2fa: boolean;

  @Column({nullable: true})
  secret2fa: string;

  @Column({ unique: true })
  email: string;

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

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.sender)
  sentFriendRequests: FriendRequest[];

  @OneToMany(() => FriendRequest, friendRequest => friendRequest.receiver)
  receivedFriendRequests: FriendRequest[];

}