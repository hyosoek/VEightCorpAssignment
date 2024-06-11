import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import * as config from 'config';
const dbConfig = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.POSTGRES_HOST || dbConfig.host,
  port: Number(process.env.POSTGRES_PORT) || dbConfig.port,
  username: process.env.POSTGRES_USERNAME || dbConfig.username,
  password: process.env.POSTGRES_PASSWORD || dbConfig.password,
  database: process.env.POSTGRES_DBNAME || dbConfig.database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
