import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel])],

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
