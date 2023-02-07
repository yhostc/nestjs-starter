import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as packageJson from '../package.json';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // logger
  const nestWinston = app.get(WINSTON_MODULE_NEST_PROVIDER);
  app.useLogger(nestWinston);
  app.useGlobalPipes(new ValidationPipe());

  // Swagger
  const options = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setVersion(packageJson.version)
    .addBearerAuth()
    .setDescription('The Draft.ai API description')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api', app, document);

  // listen
  // await app.startAllMicroservices();
  await app.listen(process.env.NODE_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
