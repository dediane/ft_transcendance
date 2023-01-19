import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, ProfileController } from './controllers';
import { AppService } from './services/app.service';
import { EventsGateway } from './gateways/socket';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({ envFilePath: ['.env'] }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   port: 3306,
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: process.env.POSTGRES_DB,
    //   entities: [],
    //   synchronize: true,
    // })
  ],
  controllers: [AppController, ProfileController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
