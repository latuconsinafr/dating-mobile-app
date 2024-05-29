import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { ServicesModule } from './services/services.module';

/**
 * Defines the application module.
 *
 * @usageNotes
 * This app module contains module as follow:
 * - {@link ConfigModule}: The module that responsible for whole application configuration
 * - {@link ServicesModule}: The module contains service module(s) which is the primary application business process
 *
 * And provides a controller as follow:
 * - {@link AppController} App controller
 */
@Module({
  imports: [ConfigModule, ServicesModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
