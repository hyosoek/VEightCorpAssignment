import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import * as config from 'config';
const dbConfig = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'mysql2',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
