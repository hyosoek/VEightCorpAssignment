import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //create application biggest root(necessary) mudule = app module
  const serverConfig = config.get('server');
  const port = serverConfig.port;

  await app.listen(port);
  Logger.log(`Application running on port ${port}`);
  //start on 3000 port
}
bootstrap();
