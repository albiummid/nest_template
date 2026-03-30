import { cleanEnv, num, port, str } from 'envalid';

/**
 * Process-level immutable configuration.
 * Validated ONCE at startup.
 */
export const ENV = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'production', 'test'],
    default: 'development',
  }),

  PORT: port({ default: 8000 }),

  // CORS
  ALLOWED_ORIGINS: str({
    default:
      'http://localhost:3000,http://localhost:4200,http://localhost:5173',
  }),

  // Database
  DB_TYPE: str({
    choices: ['mysql', 'postgres', 'sqlite', 'mssql', 'oracle'],
    default: 'mysql',
  }),
  DB_HOST: str(),
  DB_PORT: port(),
  DB_USERNAME: str(),
  DB_PASSWORD: str(),
  DB_NAME: str(),

  // Auth
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '15m' }),

  // Throttling
  THROTTLE_TTL: num({ default: 60 }), // seconds
  THROTTLE_LIMIT: num({ default: 10 }), // requests per TTL

  // // Redis
  // REDIS_ENABLED: bool({ default: false }),
  // REDIS_HOST: str({ default: 'localhost' }),
  // REDIS_PORT: port({ default: 6379 }),
});
