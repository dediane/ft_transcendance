import { Message } from 'src/message/entities/message.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('channels')
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    password: string;

    @Column({default: false})
    dm: boolean;

    @OneToMany(() => Message, message => message.channel)
    message: Message;
}
