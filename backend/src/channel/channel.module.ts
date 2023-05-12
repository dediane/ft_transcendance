import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Channel, Message, User])],

  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [TypeOrmModule, ChannelService],

})

export class ChannelModule {}



// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Channel } from './entities/channel.entity';
// import { ChannelService } from './channel.service';
// import { ChannelController } from './channel.controller';

// @Module({
//   imports: [TypeOrmModule.forFeature([Channel])],
//   controllers: [ChannelController],
//   providers: [ChannelService],
//   exports: [TypeOrmModule],
// })
// export class ChannelModule {}
