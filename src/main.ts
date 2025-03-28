import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  INestApplication,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.setGlobalPrefix('api/v1', {
    exclude: [{ path: '', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: false
  });

  await app.listen(port ?? 3000);
}
bootstrap();
