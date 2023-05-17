import { Game } from "src/game/entities/game.entity";
import { User } from "../entities/user.entity"

export class CreateUserDto {
    readonly password: string;
    gamePlayer1?: Game[];
    gamePlayer2?: Game[] ;
    losses? : number;
    wins? : number;
}
