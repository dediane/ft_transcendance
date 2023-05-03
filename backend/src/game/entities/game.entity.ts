import { Entity, Column, PrimaryGeneratedColumn, JoinTable, ManyToMany, Timestamp, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('game')
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.gamePlayer1)
    player1: User;

    @ManyToOne(() => User, (user) => user.gamePlayer2)
    player2: User;
    
    @Column('int')
    score1 : number;
    
    @Column('int')
    score2 : number;
}
