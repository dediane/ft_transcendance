import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Channel } from "src/channel/entities/channel.entity";

@Entity('message')
export class Message {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.message)
    sender: User;

    @ManyToOne(() => Channel, (channel) => channel.message)
    channel: Channel;
}
