import { ManyToOne } from "typeorm";
import { User } from "../../user/entities/user.entity"
import { IsNotEmpty, IsInt, IsDate, IsOptional } from 'class-validator'

export class CreateGameDto {
}
