import 'newrelic';
import 'reflect-metadata';

import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '~app/app.module';
import { GlobalInterceptor } from '~app/interceptors/global.interceptor';
import { GlobalExceptionFilter } from '~app/exceptions/global-exception.filter';
import * as packageJSON from '../package.json';

async function bootstrap() {
  const { CLIENT_URI, COOKIE_SECRET, NODE_ENV, PORT = 3001 } = process.env;
  const isProduction = NODE_ENV === 'production';

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('/api');
  // SET swagger
  const builder = new DocumentBuilder()
    .setTitle('BEGIN0DEV Blog')
    .setDescription('이 문서는 블로그를 위한 API 입니다.')
    .setVersion(packageJSON.version)
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: isProduction ? [CLIENT_URI, 'localhost:3000'] : '*',
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser(COOKIE_SECRET));
  app.use(morgan(isProduction ? 'tiny' : 'dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new GlobalInterceptor());

  // RUN server
  await app.listen(PORT);
  console.log(`${NODE_ENV}: Server is running on port ${PORT}`);
}

bootstrap();
