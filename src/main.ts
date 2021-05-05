import 'newrelic';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from '~app/app.module';
import * as packageJSON from '../package.json';

async function bootstrap() {
  const { CLIENT_URI, COOKIE_SECRET, PORT, NODE_ENV } = process.env;
  const isProduction = NODE_ENV === 'production';

  const app = await NestFactory.create(AppModule);

  // SET swagger
  const builder = new DocumentBuilder()
    .setTitle('BEGIN0DEV Blog')
    .setDescription('이 문서는 블로그를 위한 API 입니다.')
    .setVersion(packageJSON.version)
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api-docs', app, document);

  // SET global
  app.setGlobalPrefix('/api');

  // SET middleware
  app.enableCors({
    origin: isProduction ? [CLIENT_URI, 'localhost:3000'] : '*',
    credentials: true,
  });
  app.use(helmet());
  app.use(cookieParser(COOKIE_SECRET));
  app.use(morgan(isProduction ? 'tiny' : 'dev'));

  // RUN server
  const port = PORT || 3001;
  await app.listen(port);
  console.log(`${NODE_ENV}: Server is running on port ${port}`);
}

bootstrap();
