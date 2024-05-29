import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { appConfig } from './app/app.config';
import { loggerConfig } from './logger/logger.config';
import { LoggerModule, Params } from 'nestjs-pino';
import { databaseConfig } from './database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import dataSource from '../database/data-source';
import { jwtConfig } from './auth/jwt.config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
/**
 * Defines the application configuration module.
 *
 * @usageNotes
 * This config module contains configuration as follow:
 * - {@link ConfigModule}: The nestjs ConfigModule, load configuration based on environments
 * - {@link LoggerModule}: The nestjs-pino LoggerModule, load logger configuration
 * - {@link TypeOrmModule}: The nestjs TypeORMModule, load database configuration
 * - {@link JwtModule}: The nestjs JwtModule, load JWT configuration
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, loggerConfig, databaseConfig, jwtConfig],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<Params>('logger'),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<DataSourceOptions>('database'),
      }),
      dataSourceFactory: async () => {
        await dataSource.initialize();

        return dataSource;
      },
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<JwtModuleOptions>('jwt'),
      }),
    }),
  ],
})
export class ConfigModule {}
