import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import helmet from 'helmet'
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // app.useGlobalFilters(new HttpExceptionFilter());

  // somewhere in your initialization file
  app.use(helmet());
  const config = new DocumentBuilder()
  .setTitle('Transcendence')
  .setDescription('Transcendence API description')
  .setVersion('1.0')
  .addTag('cats')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}
bootstrap();