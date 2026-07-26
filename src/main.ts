import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from './config';
import { VersioningType } from '@nestjs/common';
import * as path from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthTypeEnum } from './infrastructures/modules/jwt/enums/jwt-type.enum';


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
    .setTitle('Event Ticketing API Documentation')
    .setDescription('API documentation for the Event Ticketing System')
    .setVersion('1.0')
    .addTag('api')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT for access token',
        in: 'header',
      },
      JwtAuthTypeEnum.AccessToken,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT for refresh token',
        in: 'header',
      },
      JwtAuthTypeEnum.RefreshToken,
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);


  await app.listen(config.app.port);
}
bootstrap();
