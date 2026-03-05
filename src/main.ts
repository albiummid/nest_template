import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { WinstonModule } from 'nest-winston';
import { HttpExceptionFilter } from './common/filters/exception.filters';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { winstonConfig } from './common/logger/winston.config';
import { ENV } from './config/env';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
      maxParamLength: 5000,
    }) as any,
    {
      logger: WinstonModule.createLogger(winstonConfig),
    },
  );

  const config = new DocumentBuilder()
    .setTitle('OfficeDesk API')
    .setDescription('The OfficeDesk API description')
    .setVersion('1.0')
    .addTag('OfficeDesk')
    .addServer(`http://localhost:${ENV.PORT}/api`)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  /* ... */

  app.use(
    '/reference',
    apiReference({
      content: documentFactory(),
      withFastify: true, // Required when using Fastify adapter
    }),
  );

  /* -------------------- Fastify plugins -------------------- */
  await app.register(fastifyCors as any, {
    origin:
      ENV.NODE_ENV === 'development'
        ? true
        : [
            /* specify origins */
          ],
    credentials: true,
  });

  await app.register(fastifyHelmet as any);

  await app.register(fastifyCookie as any);

  await app.register(fastifyMultipart as any, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  });

  /* -------------------- Global configs -------------------- */
  /* LIFE CYCLE 

    | Request -> Middleware -> Guards -> Interceptors -> Pipes -> Controller -> Interceptors -> Filters -> Response / Exception Filters | 
  
  */

  // Prefix
  app.setGlobalPrefix('api');

  // Middlewares

  // Guards

  // Request Interceptors

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Response Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  /* -------------------- Start server -------------------- */
  // const configService = app.get(ConfigService);
  // const port = configService.get<number>('PORT', 8000);
  await app.listen(ENV.PORT, '0.0.0.0');

  logger.log(`🚀 API running at http://localhost:${ENV.PORT}/api (Fastify)`);
  logger.log(
    `🔥 API scalar (swagger) running at http://localhost:${ENV.PORT}/reference`,
  );
}

bootstrap();
