import { Body, Controller, Post, Req } from '@nestjs/common';
import { APP_VERSION } from '../../common/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { SwipesService } from './swipes.service';
import { UseJwtAuth } from '../auth/decorators/use-jwt-auth.decorator';
import { SWIPE_CREATED_MESSAGE } from './constants';
import { SwipeResponse } from './dto/responses/swipe-response.dto';
import { RequestWithAuthUser } from '../auth/types/request-with-auth-user.interface';
import { CreateSwipeRequest } from './dto/requests/create-swipe-request.dto';
import { SuccessResponse } from '../../common/dto/responses/success-response.dto';
import { InternalServerErrorException } from '../../common/exceptions/internal-server-error.exception';
import { ApiUnprocessableEntityErrorResponse } from '../../common/decorators/open-api/errors/api-unprocessable-entity-error-response.decorator';
import { ApiForbiddenErrorResponse } from '../../common/decorators/open-api/errors/api-forbidden-error-response.decorator';
import { ApiUnauthorizedErrorResponse } from '../../common/decorators/open-api/errors/api-unauthorized-error-response.decorator';
import { ApiErrorsResponse } from '../../common/decorators/open-api/api-errors-response.decorator';
import { ApiCreatedSuccessResponse } from '../../common/decorators/open-api/successes/api-created-success-response.decorator';
import { ApiSuccessesResponse } from '../../common/decorators/open-api/api-successes-response.decorator';
import { USER_INCONSISTENT_ID_MESSAGE } from '../users/constants';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { UnprocessableEntityException } from '../../common/exceptions/unprocessable-entity.exception';

@Controller({
  path: 'swipes',
  version: APP_VERSION,
})
@ApiTags('Swipes')
export class SwipesController {
  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param swipesService The swipes service
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly swipesService: SwipesService,
  ) {
    this.logger.setContext(SwipesController.name);
  }

  /**
   * Create a swipe endpoint.
   *
   * @param user The authenticated user who made the request
   * @param createSwipeRequest The DTO that carries data to create a swipe
   *
   * @returns The success response with {@link SWIPE_CREATED_MESSAGE} message and created `swipe` data.
   */
  @Post()
  @UseJwtAuth()
  @ApiBearerAuth()
  @ApiSuccessesResponse([
    {
      response: ApiCreatedSuccessResponse,
      options: {
        model: SwipeResponse,
        options: { description: SWIPE_CREATED_MESSAGE },
      },
    },
  ])
  @ApiErrorsResponse([
    { response: ApiUnauthorizedErrorResponse },
    { response: ApiForbiddenErrorResponse },
    { response: ApiUnprocessableEntityErrorResponse },
  ])
  async createSwipe(
    @Req() { user }: RequestWithAuthUser,
    @Body() createSwipeRequest: CreateSwipeRequest,
  ): Promise<SuccessResponse<SwipeResponse>> {
    this.logger.info(
      `Try to call ${SwipesController.prototype.createSwipe.name}`,
    );

    if (user.id !== createSwipeRequest.userId) {
      throw new ConflictException({ message: USER_INCONSISTENT_ID_MESSAGE });
    }

    try {
      return new SuccessResponse({
        message: SWIPE_CREATED_MESSAGE,
        data: await this.swipesService.create(
          CreateSwipeRequest.toEntity(createSwipeRequest, user),
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
