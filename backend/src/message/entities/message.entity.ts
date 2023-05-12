import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Channel } from "src/channel/entities/channel.entity";

@Entity('message')
export class Message {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    content: string;

    @ManyToOne(() => User, (user) => user.messages)
    sender: User;

    @ManyToOne(() => Channel, (channel) => channel.messages, { onDelete: 'CASCADE' })
    channel: Channel;

    
}
