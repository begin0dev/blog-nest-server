import 'reflect-metadata';

import helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { Server } from 'http';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createServer, proxy } from 'aws-serverless-express';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '~app/app.module';
import { GlobalInterceptor } from '~app/interceptors/global.interceptor';
import { GlobalExceptionFilter } from '~app/exceptions/global-exception.filter';
import * as packageJSON from '../package.json';

import express = require('express');

function setMiddleware(app: INestApplication) {
  const isProd = process.env.NODE_ENV === 'production';

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
    origin: isProd ? [process.env.CLIENT_URI, 'localhost:3000'] : '*',
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(morgan(isProd ? 'tiny' : 'dev'));
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new GlobalInterceptor());
}

async function localServer() {
  const nestApp = await NestFactory.create<NestExpressApplication>(AppModule);
  setMiddleware(nestApp);
  return nestApp;
}

let cachedServer: Server;
const binaryMimeTypes: string[] = [];

async function lambdaServer() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    setMiddleware(nestApp);
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
  }
  return cachedServer;
}

export const runLambda: APIGatewayProxyHandler = async (event, context) => {
  cachedServer = await lambdaServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};

const runLocal = async () => {
  const { NODE_ENV, PORT = 3001 } = process.env;
  const nestApp = await localServer();
  await nestApp.listen(PORT);
  console.log(`${NODE_ENV}: Server is running on port ${PORT}`);
};

if (process.env.NODE_ENV !== 'production') {
  runLocal();
}
