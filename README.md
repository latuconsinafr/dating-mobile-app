<p align="center">
  <a href="https://github.com/latuconsinafr/dating-mobile-app-api" target="blank"><img src="https://cdn-icons-png.flaticon.com/512/1456/1456503.png" width="200" alt="Dating App Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">This is a sample application of dating mobile app similar to <a href="https://tinder.com/">Tinder</a>/<a href="https://bumble.com/">Bumble</a> (but in a more simpler way). <br />Built on top of NestJS framework and under RESTful APIs architecture.</p>

## Description

This is a sample application of dating mobile app, similar to Tinder/Bumble but in a more simpler way, built on top of NestJS framework and under RESTful APIs architecture which is consists of 5 main modules:
- Auth (responsible for authentication)
- Users (responsible for user-related operations)
- Profiles (responsible for profile-related operations)
- Swipes (responsible for swipe-related operations)
- Subscriptions (responsible for subscription-related operations)

### Application structure

    .
    ├── src                          # Main code files
    |    ├── common                  # Provide various functionalities for the whole application (being used accross multiple services)
    |    ├── config                  # Provide the configuration for the application, including app, auth, database and logger configuration
    |    ├── database                # Provide various functionalities related to the database, including sample data, migrations and seeds
    |    ├── services                # Main services code
    |    |    ├── auth               # Auth service
    |    |    ├── profiles           # Profiles service 
    |    |    ├── subscriptions      # Subscriptions service
    |    |    ├── swipes             # Swipes service
    |    |    ├── users              # Users service
    |    |    └── services.module.ts # The main module for the application services
    |    ├── app.controller.ts       # The main entry point for the application
    |    ├── app.module.ts           # The main module for the application
    |    └── main.ts                 # The main function to bootstrap the whole application
    ├── test                         # Test files, for the e2e test
    ├── ...       
    ├── .env                         # To store configuration settings, environment variables, and sensitive information securely 
    ├── wait-for-it.sh               # Script that will wait on the availability of a host and TCP port (especially when running command in docker environment) 
    └── ...

> Please follow the current folder & files structure 


## Installation and running the app

The application itself has been dockerized, so it might be installed via docker or via local machine. But, make sure that the code is already on your local machine first.
Setup the environment variables by duplicating the `.env.example` (don't forget to change the directory to the code directory)

```bash
$ cp .env.example .env
```

### With Docker
By default, you can use the default .env (which is the same value as .env.example). Start up the services (also build the images before starting the container).

```bash
$ docker compose up --build
```

### In Local Machine
When you run the application in the local machine, several configurations in the `.env` file might be configured first (e.g, app host, port, database host, port, etc.).

Install the dependencies
```bash
npm install
```

Run the migration and also the seeds
```bash
npm run migration:run && npm run seed:run
```

Finally run the app using the following commands

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

For example, if you have set the `HOST` to `localhost` and the `PORT` to `3000`, you might check the running application on <b>`http://localhost:3000/`</b>

## Test

To run the tests
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## OpenAPI
The [OpenAPI](https://swagger.io/specification/) specification is a language-agnostic definition format used to describe RESTful APIs. This application provides the API documentation following the OpenAPI specification.

![screencapture-localhost-3000-docs-v1-2024-05-30-16_37_56](https://github.com/latuconsinafr/dating-mobile-app-api/assets/23124690/8524d3cf-86a8-4895-a124-341c8a8370ca)

The list of end-points are:
### App
- **{GET}** / (main app end-point)

### Auth
- **{GET}** /v1/auth (get authenticated user)
- **{POST}** /v1/auth/sign-in (sign in to the application)
- **{POST}** /v1/auth/sign-up (sign up to the application)

### Profiles
- **{GET}** /v1/profiles/{id}/stack (get profile stacks for the swipe)

### Swipes
- **{POST}** /v1/swipes (like or pass a specified profile)

### Subscriptions
- **{POST}** /v1/subscriptions (buy a subscription, it could be either unlimited swipe or is verified profile for a specified time window)

## Other
Several features which is also provided by this application:
- Logging (using pino logger)
- Validation and transformation (using class-validator and class-transformer)
- Global http exception filters (including the custom exception) and global transform (to transform the shape of the response object) 
- Custom various functionalities (within the `common` folder)
  
## Support

This sample application built on top NestJS which is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Farista Latuconsina](mailto::faristalatuconsina@gmail.com)
- Twitter - [@latuconsinafr](https://twitter.com/latuconsinafr)

## License

This application is [MIT licensed](LICENSE).
