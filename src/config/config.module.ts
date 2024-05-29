import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { appConfig } from './app/app.config';
import { loggerConfig } from './logger/logger.config';
import { LoggerModule, Params } from 'nestjs-pino';
/**
 * Defines the application configuration module.
 *
 * @usageNotes
 * This config module contains configuration as follow:
 * - {@link ConfigModule}: The nestjs ConfigModule, load configuration based on environments
 * - {@link LoggerModule}: The nestjs-pino LoggerModule, load logger configuration
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, loggerConfig],
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...configService.get<Params>('logger'),
      }),
    }),
  ],
})
export class ConfigModule {}
