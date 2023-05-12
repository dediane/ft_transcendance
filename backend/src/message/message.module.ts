import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { Message } from './entities/message.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/channel.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    ChannelModule
  ],

  providers: [MessageGateway, MessageService],
  exports: [TypeOrmModule, MessageService]

})
export class MessageModule {}
