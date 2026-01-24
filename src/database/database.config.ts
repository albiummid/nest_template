import { ENV } from '@/config/env';
import { join } from 'path';
import { DataSourceOptions } from 'typeorm';

export const databaseConfig: DataSourceOptions = {
  type: ENV.DB_TYPE as any,
  host: ENV.DB_HOST,
  port: Number(ENV.DB_PORT),
  username: ENV.DB_USERNAME,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,

  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '../**/migrations/*.{ts,js}')],
  subscribers: [join(__dirname, '../**/*.subscriber.{ts,js}')],

  synchronize: false, // 🚨 NEVER true for migrations
  logging: ENV.NODE_ENV === 'development',
};
