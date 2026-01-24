import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';
import 'dotenv/config'; // Validation happens in ENV, but we need dotenv to load env vars if checking directly or rely on ENV autoloading?
// Actually database.config imports ENV which does `import 'dotenv/config'`, so we might not need explicit dotenv here if we are careful.
// However, the original file used dotenv directly. Let's see if we can just rely on databaseConfig which imports ENV which imports dotenv.

// database.config.ts imports ENV which does import 'dotenv/config';
// so just importing databaseConfig should be enough to load envs.

export const AppDataSource = new DataSource(databaseConfig);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
