import { Game } from "src/game/entities/game.entity";
import { User } from "../entities/user.entity"
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    readonly username: string;
    readonly login42?: string;
    readonly is2fa?: boolean;
    readonly secret2fa?: string;
    @IsEmail()
    readonly email: string;
    readonly socketids?: string[];
    readonly avatar?: string;
    readonly password: string;
    friends?: User[];
    gamePlayer1?: Game[];
    gamePlayer2?: Game[] ;
    losses? : number;
    wins? : number;
}
