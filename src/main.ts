import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const { COOKIE_SECRET, PORT, NODE_ENV } = process.env;

  const app = await NestFactory.create(AppModule);

  const builder = new DocumentBuilder()
    .setTitle('BEGIN0DEV Blog')
    .setDescription('이 문서는 블로그를 위한 API 입니다.')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('api-docs', app, document);

  app.setGlobalPrefix('api');

  app.enableCors();
  app.use(helmet());
  app.use(cookieParser(COOKIE_SECRET));

  await app.listen(PORT || 3001);
  console.log(`${NODE_ENV}: Server is running on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
