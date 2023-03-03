import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Game } from 'src/game/entities/game.entity';
import { Message } from 'src/message/entities/message.entity';

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

  @Column({ nullable: true })
  avatar: string;

  @Column()
  password: string;

  @Column({default: 0})
  wins: number;

  @Column({default: 0})
  losses: number;

  // @OneToMany(() => Game, (game) => game.player1)
  // gamePlayer1: Game[];

  // @OneToMany(() => Game, (game) => game.player2)
  // gamePlayer2: Game[];

  // @OneToMany(() => Message, (message) => message.sender)
  // message: Message[];
}