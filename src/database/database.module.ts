// database.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database.config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...databaseConfig,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
