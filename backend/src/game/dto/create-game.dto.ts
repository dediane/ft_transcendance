import { ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity"
import { IsNotEmpty, IsInt, IsDate, IsOptional } from 'class-validator'

export class CreateGameDto {
    @IsInt()
    @IsNotEmpty()
    id: number; // id of the game
    
    @IsNotEmpty()
    @ManyToOne (() => User, user => user.gamePlayer1)
    user1: User;

    @IsNotEmpty()
    @ManyToOne (() => User, user => user.gamePlayer2)
    user2: User;

    @IsOptional()
    score1: number;

    @IsOptional()
    score2: number;

    @IsDate()
    created_at: Date;
}
