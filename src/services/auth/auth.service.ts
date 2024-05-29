import { Injectable } from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { AuthResponse } from './types/auth-response.interface';
import * as argon2 from 'argon2';

/**
 * Defines the auth service that responsible for application authentication.
 */
@Injectable()
export class AuthService {
  /**
   * Defines the jwt module options for authentication processes.
   */
  private readonly jwtModuleOptions: JwtModuleOptions;

  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param usersService The users service
   * @param jwtService The JWT service
   * @param configService The config service
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AuthService.name);
    this.jwtModuleOptions = {
      ...this.configService.get<JwtModuleOptions>('jwt'),
    };
  }

  /**
   * Verify the user's authorization with the given username and password.
   *
   * @param username The username to verify
   * @param password The password to verify
   *
   * @returns The verified user entity.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    this.logger.info(`Try to call ${AuthService.prototype.validateUser.name}`);

    const user = await this.usersService.findByUsername(username);

    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }

    return null;
  }

  /**
   * Signs in the requested user and generates auth response.
   *
   * @param user The requested user to be signed
   *
   * @returns The {@link AuthResponse}.
   */
  async signIn(user: User): Promise<AuthResponse> {
    this.logger.info(`Try to call ${AuthService.prototype.signIn.name}`);

    const payload = { username: user.username, sub: user.id };

    await this.usersService.update(user.id, {
      ...user,
      lastSignedInAt: new Date(),
    });

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.jwtModuleOptions.secret,
        expiresIn: this.jwtModuleOptions.signOptions?.expiresIn,
      }),
      expiresIn: this.jwtModuleOptions.signOptions?.expiresIn,
    };
  }

  /**
   * Sign up a user.
   *
   * @param user A user to sign up
   *
   * @returns The signed up user.
   */
  async signUp(user: User): Promise<User> {
    this.logger.info(`Try to call ${AuthService.prototype.signUp.name}`);

    return await this.usersService.create(user);
  }
}
