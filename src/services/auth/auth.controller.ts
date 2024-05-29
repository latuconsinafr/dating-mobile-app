import { Controller, Get, Req, Post, HttpCode, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { APP_VERSION } from '../../common/constants';
import { ApiErrorsResponse } from '../../common/decorators/open-api/api-errors-response.decorator';
import { ApiSuccessesResponse } from '../../common/decorators/open-api/api-successes-response.decorator';
import { ApiUnauthorizedErrorResponse } from '../../common/decorators/open-api/errors/api-unauthorized-error-response.decorator';
import { ApiUnprocessableEntityErrorResponse } from '../../common/decorators/open-api/errors/api-unprocessable-entity-error-response.decorator';
import { ApiOkSuccessResponse } from '../../common/decorators/open-api/successes/api-ok-success-response.decorator';
import { SuccessResponse } from '../../common/dto/responses/success-response.dto';
import { AuthService } from './auth.service';
import { UseJwtAuth } from './decorators/use-jwt-auth.decorator';
import { RequestWithAuthUser } from './types/request-with-auth-user.interface';
import { SignInRequest } from './dto/requests/sign-in-request.dto';
import { SignInResponse } from './dto/responses/sign-in-response.dto';
import {
  USER_AUTHENTICATED_MESSAGE,
  USER_SIGNED_IN_MESSAGE,
  USER_SIGNED_UP_MESSAGE,
  WRONG_CREDENTIAL_MESSAGE,
} from './constants';
import { InternalServerErrorException } from '../../common/exceptions/internal-server-error.exception';
import { UseLocalAuth } from './decorators/use-local-auth.decorator';
import { SignUpResponse } from './dto/responses/sign-up-response.dto';
import { SignUpRequest } from './dto/requests/sign-up-request.dto';
import { UserDetailResponse } from '../users/dto/responses/user-detail-response.dto';

/**
 * Defines the auth controller.
 */
@Controller({
  path: 'auth',
  version: APP_VERSION,
})
@ApiTags('Auth')
export class AuthController {
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
    this.logger.setContext(AuthController.name);
  }

  /**
   * Gets an authenticated user with a given token payload endpoint.
   *
   * @param user The authenticated user
   *
   * @returns The success response with {@link USER_AUTHENTICATED_MESSAGE} message and a `user` data.
   */
  @Get()
  @UseJwtAuth()
  @ApiBearerAuth()
  @ApiSuccessesResponse([
    {
      response: ApiOkSuccessResponse,
      options: {
        model: UserDetailResponse,
        options: { description: USER_AUTHENTICATED_MESSAGE },
      },
    },
  ])
  @ApiErrorsResponse([{ response: ApiUnauthorizedErrorResponse }])
  async authenticate(
    @Req() { user }: RequestWithAuthUser,
  ): Promise<SuccessResponse<UserDetailResponse>> {
    this.logger.info(
      `Try to call ${AuthController.prototype.authenticate.name}`,
    );

    return new SuccessResponse({
      message: USER_AUTHENTICATED_MESSAGE,
      data: user,
    });
  }

  /**
   * Signs in a user with a given username and password endpoint.
   *
   * @param user The authenticated user
   *
   * @returns The success response with {@link USER_SIGNED_IN_MESSAGE} message and an `AuthResponse` data.
   */
  @Post('sign-in')
  @HttpCode(200)
  @UseLocalAuth()
  @ApiBody({ type: SignInRequest })
  @ApiSuccessesResponse([
    {
      response: ApiOkSuccessResponse,
      options: {
        model: SignInResponse,
        options: { description: USER_SIGNED_IN_MESSAGE },
      },
    },
  ])
  @ApiErrorsResponse([
    {
      response: ApiUnprocessableEntityErrorResponse,
      options: { description: WRONG_CREDENTIAL_MESSAGE },
    },
  ])
  async signIn(
    @Req() { user }: RequestWithAuthUser,
  ): Promise<SuccessResponse<SignInResponse>> {
    this.logger.info(`Try to call ${AuthController.prototype.signIn.name}`);

    try {
      return new SuccessResponse({
        message: USER_SIGNED_IN_MESSAGE,
        data: await this.authService.signIn(user),
      });
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);

      throw new InternalServerErrorException();
    }
  }

  /**
   * Signs in a user with a given username and password endpoint.
   *
   * @param user The authenticated user
   *
   * @returns The success response with {@link USER_SIGNED_UP_MESSAGE} message and an `AuthResponse` data.
   */
  @Post('sign-up')
  @HttpCode(200)
  @ApiSuccessesResponse([
    {
      response: ApiOkSuccessResponse,
      options: {
        model: SignUpResponse,
        options: { description: USER_SIGNED_UP_MESSAGE },
      },
    },
  ])
  @ApiErrorsResponse([{ response: ApiUnprocessableEntityErrorResponse }])
  async signUp(
    @Body() signUpRequest: SignUpRequest,
  ): Promise<SuccessResponse<SignUpResponse>> {
    this.logger.info(`Try to call ${AuthController.prototype.signUp.name}`);

    try {
      return new SuccessResponse({
        message: USER_SIGNED_UP_MESSAGE,
        data: await this.authService.signUp(
          SignUpRequest.toEntity(signUpRequest),
        ),
      });
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);

      throw new InternalServerErrorException();
    }
  }
}
