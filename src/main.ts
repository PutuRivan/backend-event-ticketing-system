import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from './config';
import { VersioningType } from '@nestjs/common';
import * as path from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });
  app.useBodyParser('json', { limit: config.app.requestBodyLimitInBytes });
  app.useBodyParser('urlencoded', {
    extended: true,
    limit: config.app.requestUrlencodedBodyLimitInBytes,
  });

  // Enable CORS
  app.enableCors();

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Storage Path
  const storagePath = path.join(__dirname, '..', config.storage.rootPath);
  app.useStaticAssets(storagePath, {
    prefix: `/${config.storage.rootPath}/`,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for the application')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(config.app.port);
}
bootstrap();
