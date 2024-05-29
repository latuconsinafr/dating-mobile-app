import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { PinoLogger } from 'nestjs-pino';
import { Strategy } from 'passport-local';
import { User } from '../../users/entities/user.entity';
import { UnprocessableEntityException } from '../../../common/exceptions/unprocessable-entity.exception';
import { AuthService } from '../auth.service';
import { WRONG_CREDENTIAL_MESSAGE } from '../constants';

/**
 * Defines the strategy for custom strategy by extending PassportStrategy with Strategy from `passport-custom`.
 *
 * @usageNotes
 * This strategy being used by the guards under `AuthGuard('custom')`.
 *
 * @see [Implementing Passport Strategy](https://docs.nestjs.com/security/authentication#implementing-passport-strategies)
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param authService The auth service
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly authService: AuthService,
  ) {
    super();

    this.logger.setContext(LocalStrategy.name);
  }

  /**
   * To validate the {@link LocalAuthGuard}.
   *
   * @usageNotes
   * For each strategy, Passport will call the verify function (implemented with the validate() method in nestjs/passport) using an appropriate strategy-specific set of parameters.
   
  * @param username The username to validate
   * @param password The password to validate
   *
   * @returns The user entity.
   */
  async validate(username: string, password: string): Promise<User> {
    this.logger.info(`Try to call ${LocalStrategy.prototype.validate.name}`);

    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnprocessableEntityException({
        message: WRONG_CREDENTIAL_MESSAGE,
      });
    }

    return user;
  }
}
