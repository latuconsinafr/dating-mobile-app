import { Controller, Post, Req, Body, ConflictException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { APP_VERSION } from '../../common/constants';
import { ApiErrorsResponse } from '../../common/decorators/open-api/api-errors-response.decorator';
import { ApiSuccessesResponse } from '../../common/decorators/open-api/api-successes-response.decorator';
import { ApiForbiddenErrorResponse } from '../../common/decorators/open-api/errors/api-forbidden-error-response.decorator';
import { ApiUnauthorizedErrorResponse } from '../../common/decorators/open-api/errors/api-unauthorized-error-response.decorator';
import { ApiUnprocessableEntityErrorResponse } from '../../common/decorators/open-api/errors/api-unprocessable-entity-error-response.decorator';
import { ApiCreatedSuccessResponse } from '../../common/decorators/open-api/successes/api-created-success-response.decorator';
import { SuccessResponse } from '../../common/dto/responses/success-response.dto';
import { UseJwtAuth } from '../auth/decorators/use-jwt-auth.decorator';
import { RequestWithAuthUser } from '../auth/types/request-with-auth-user.interface';
import { USER_INCONSISTENT_ID_MESSAGE } from '../users/constants';
import { SUBSCRIPTION_CREATED_MESSAGE } from './constants';
import { CreateSubscriptionRequest } from './dto/requests/create-subscription-request.dto';
import { SubscriptionResponse } from './dto/responses/subscription-response.dto';
import { SubscriptionsService } from './subscriptions.service';
import { InternalServerErrorException } from '../../common/exceptions/internal-server-error.exception';
import { UnprocessableEntityException } from '../../common/exceptions/unprocessable-entity.exception';

@Controller({
  path: 'subscriptions',
  version: APP_VERSION,
})
@ApiTags('Subscriptions')
export class SubscriptionsController {
  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param subscriptionsService The subscriptions service
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly subscriptionsService: SubscriptionsService,
  ) {
    this.logger.setContext(SubscriptionsController.name);
  }

  /**
   * Create a subscription endpoint.
   *
   * @param user The authenticated user who made the request
   * @param createSubscriptionRequest The DTO that carries data to create a subscription
   *
   * @returns The success response with {@link SUBSCRIPTION_CREATED_MESSAGE} message and created `subscription` data.
   */
  @Post()
  @UseJwtAuth()
  @ApiBearerAuth()
  @ApiSuccessesResponse([
    {
      response: ApiCreatedSuccessResponse,
      options: {
        model: SubscriptionResponse,
        options: { description: SUBSCRIPTION_CREATED_MESSAGE },
      },
    },
  ])
  @ApiErrorsResponse([
    { response: ApiUnauthorizedErrorResponse },
    { response: ApiForbiddenErrorResponse },
    { response: ApiUnprocessableEntityErrorResponse },
  ])
  async createSubscription(
    @Req() { user }: RequestWithAuthUser,
    @Body() createSubscriptionRequest: CreateSubscriptionRequest,
  ): Promise<SuccessResponse<SubscriptionResponse>> {
    this.logger.info(
      `Try to call ${SubscriptionsController.prototype.createSubscription.name}`,
    );

    if (user.id !== createSubscriptionRequest.userId) {
      throw new ConflictException({ message: USER_INCONSISTENT_ID_MESSAGE });
    }

    try {
      return new SuccessResponse({
        message: SUBSCRIPTION_CREATED_MESSAGE,
        data: await this.subscriptionsService.create(
          CreateSubscriptionRequest.toEntity(createSubscriptionRequest, user),
        ),
      });
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);

      if (error instanceof UnprocessableEntityException) {
        throw error;
      }

      throw new InternalServerErrorException();
    }
  }
}
