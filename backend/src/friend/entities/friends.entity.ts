// friend-request.entity.t
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('friend_requests')
@Unique(['sender', 'receiver'])
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.sentFriendRequests)
  sender: User;

  @ManyToOne(() => User, user => user.receivedFriendRequests)
  receiver: User;

  @Column({ type: 'enum', enum: ['PENDING', 'ACCEPTED', 'REJECTED'], default: 'PENDING' })
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}
