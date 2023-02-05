import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController, ProfileController } from './controllers';
import { AppService } from './services/app.service';
import { EventsGateway } from './gateways/socket';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database.module';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({ 
      envFilePath: ['.env'] ,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      })
    }),
    DatabaseModule,
    // AuthModule,
    UserModule,
  ],
  controllers: [AppController, ProfileController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
