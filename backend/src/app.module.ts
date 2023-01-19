import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, ProfileController } from './controllers';
import { AppService } from './services/app.service';
import { EventsGateway } from './gateways/socket';

@Module({
  imports: [ConfigModule, ConfigModule.forRoot({ envFilePath: ['.env'] })],
  controllers: [AppController, ProfileController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
