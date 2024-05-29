import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationError, useContainer } from 'class-validator';
import { AppConfigOptions, Environment } from './config/app/app.config';
import { Logger } from 'nestjs-pino';
import {
  ClassSerializerInterceptor,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  APP_AUTHOR_EMAIL,
  APP_AUTHOR_NAME,
  APP_AUTHOR_URL,
  APP_DESCRIPTION,
  APP_NAME,
  APP_TERMS_OF_SERVICE,
  APP_VERSION,
} from './common/constants';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * Defines the application bootstrapping function
 */
async function bootstrap() {
  // * App module section
  const app = await NestFactory.create(AppModule, {
    // * Make it throw an error instead exit with the code 1
    // * @see {@link https://docs.nestjs.com/first-steps) documentation}
    abortOnError: false,
    // * This will force NestJS to wait for logger to be ready instead of using built-in logger on start
    bufferLogs: true,
  });

  // * Class-validator provides very handy useContainer function, which allow to set the container to be used by class-validator library.
  // * @see {@link https://github.com/typestack/class-validator#using-service-container}
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // * Config section
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfigOptions>('app') ?? {
    environment: Environment.DEVELOPMENT,
    host: 'localhost',
    port: 3000,
    debug: true,
  };

  // * Logger section
  // ! The global has to use the `Logger` class from `nestjs-pino`, other than that has to use the `PinoLogger` class
  const logger = app.get(Logger);
  app.useLogger(logger);

  // * Global prefix & versioning section
  // app.setGlobalPrefix(APP_GLOBAL_PREFIX);
  app.enableVersioning({
    // * This versioning uses the version passed within the URL `https://example.com/v1/{route}`
    // * @see {@link https://docs.nestjs.com/techniques/versioning#uri-versioning-type}
    type: VersioningType.URI,
  });

  // * CORS section
  app.enableCors();

  // * Global middleware section
  // ! Note that applying helmet as global or registering it must come before other calls to app.use() or setup functions that may call app.use()
  // * @see {@link https://docs.nestjs.com/security/helmet}
  app.use(helmet());

  // * Global filter section
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // * Global pipe section
  app.useGlobalPipes(
    new ValidationPipe({
      // * Some production environments prefer to disable detailed errors
      disableErrorMessages: appConfig.environment === Environment.PRODUCTION,

      // * To filter out properties that should not be received by the method handler
      // * @see {@link https://docs.nestjs.com/techniques/validation#stripping-properties}
      whitelist: true,

      // * Payloads coming in over the network are plain JavaScript objects
      // * If this set to true, it will automatically transform payloads to be objects typed according to their DTO classes.
      // * @see {@link https://docs.nestjs.com/techniques/validation#transform-payload-objects}
      transform: true,

      // * This option has to be default (default -> true) somewhere near the future for security's sake (to prevent sql injection, xss attacks, etc)
      // * The break changes with 0.14.0 class-validator version makes the default forbidUnknownValues to true, which is raised the "an unknown value was passed to the validate function" error
      // * @see {@link https://github.com/nestjs/nest/issues/10683 issue}
      // forbidUnknownValues: true,

      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  // * Global interceptor section
  app.useGlobalInterceptors(
    new TransformInterceptor(app.get(Reflector)),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  // * Open API section
  SwaggerModule.setup(
    `docs/v${APP_VERSION}`,
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(APP_NAME)
        .setDescription(APP_DESCRIPTION)
        .setVersion(APP_VERSION)
        .setTermsOfService(APP_TERMS_OF_SERVICE)
        .setContact(APP_AUTHOR_NAME, APP_AUTHOR_URL, APP_AUTHOR_EMAIL)
        .addBearerAuth({
          // * According to {@link https://stackoverflow.com/questions/68808863/nestjs-swagger-does-not-set-authorization-headers}
          // * Also was tested without prefix 'Bearer ' before the token
          description: `Please enter token in following format: Bearer [token]`,
          name: 'Authorization',
          bearerFormat: 'Bearer', // * Tested not to use this field, but the result was the same
          scheme: 'Bearer',
          type: 'http', // * Attempted type: 'apiKey' too
          in: 'Header',
        })
        .build(),
    ),
  );

  await app.listen(appConfig.port, appConfig.host);
}
bootstrap();
