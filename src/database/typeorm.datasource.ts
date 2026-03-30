import { Logger } from '@nestjs/common';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

const logger = new Logger('TypeORM');

export const AppDataSource = new DataSource(databaseConfig);

AppDataSource.initialize()
  .then(() => {
    logger.log('Data Source has been initialized!');
  })
  .catch((err) => {
    logger.error('Error during Data Source initialization', err);
    process.exit(1);
  });
