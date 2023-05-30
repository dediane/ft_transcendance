import { Game } from "src/game/entities/game.entity";
import { User } from "../entities/user.entity"

export class CreateUserDto {
    readonly username: string;
    readonly login42?: string;
    readonly is2fa?: boolean;
    readonly secret2fa?: string;
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
