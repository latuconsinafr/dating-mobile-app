import { Controller, Get, Param, Req } from '@nestjs/common';
import { APP_VERSION } from '../../common/constants';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { PinoLogger } from 'nestjs-pino';
import { UseJwtAuth } from '../auth/decorators/use-jwt-auth.decorator';
import { ApiSuccessesResponse } from '../../common/decorators/open-api/api-successes-response.decorator';
import { ApiOkSuccessResponse } from '../../common/decorators/open-api/successes/api-ok-success-response.decorator';
import { ProfileResponse } from './dto/responses/profile-response.dto';
import {
  PROFILES_RETRIEVED_MESSAGE,
  PROFILE_ID_DESCRIPTION,
  PROFILE_INCONSISTENT_ID_MESSAGE,
} from './constants';
import { ApiErrorsResponse } from '../../common/decorators/open-api/api-errors-response.decorator';
import { ApiUnauthorizedErrorResponse } from '../../common/decorators/open-api/errors/api-unauthorized-error-response.decorator';
import { ApiForbiddenErrorResponse } from '../../common/decorators/open-api/errors/api-forbidden-error-response.decorator';
import { ApiUnprocessableEntityErrorResponse } from '../../common/decorators/open-api/errors/api-unprocessable-entity-error-response.decorator';
import { RequestWithAuthUser } from '../auth/types/request-with-auth-user.interface';
import { ProfileByIdPipe } from './pipes/profile-by-id.pipe';
import { SuccessResponse } from '../../common/dto/responses/success-response.dto';
import { Profile } from './entities/profile.entity';
import { ConflictException } from '../../common/exceptions/conflict.exception';
import { InternalServerErrorException } from '../../common/exceptions/internal-server-error.exception';
import { ApiUuidParam } from '../../common/decorators/open-api/params/api-uuid-param.decorator';
import { ApiNotFoundErrorResponse } from '../../common/decorators/open-api/errors/api-not-found-error-response.decorator';

/**
 * Defines the profiles controller.
 */
@Controller({
  path: 'profiles',
  version: APP_VERSION,
})
@ApiTags('Profiles')
export class ProfilesController {
  /**
   * The constructor.
   *
   * @param logger The pino logger
   * @param profilesService The profiles service
   */
  constructor(
    private readonly logger: PinoLogger,
    private readonly profilesService: ProfilesService,
  ) {
    this.logger.setContext(ProfilesController.name);
  }

  /**
   * Get all profiles as stack for a specified user/profile endpoint.
   *
   * @param user The authenticated user who made the request
   * @param profile The specified profile to get the stack from
   *
   * @returns The success response with {@link PROFILES_RETRIEVED_MESSAGE} message and `profiles` data.
   */
  @Get(':id/stack')
  @UseJwtAuth()
  @ApiBearerAuth()
  @ApiUuidParam({ name: 'id', description: PROFILE_ID_DESCRIPTION })
  @ApiSuccessesResponse([
    {
      response: ApiOkSuccessResponse,
      options: {
        model: ProfileResponse,
        options: { description: PROFILES_RETRIEVED_MESSAGE },
      },
    },
  ])
  @ApiErrorsResponse([
    { response: ApiUnauthorizedErrorResponse },
    { response: ApiForbiddenErrorResponse },
    { response: ApiNotFoundErrorResponse },
    { response: ApiUnprocessableEntityErrorResponse },
  ])
  async findProfileStack(
    @Req() { user }: RequestWithAuthUser,
    @Param('id', ProfileByIdPipe) { id }: Profile,
  ): Promise<SuccessResponse<ProfileResponse[]>> {
    this.logger.info(
      `Try to call ${ProfilesController.prototype.findProfileStack.name}`,
    );

    if (id !== user.id) {
      throw new ConflictException({ message: PROFILE_INCONSISTENT_ID_MESSAGE });
    }

    try {
      const profiles = await this.profilesService.findStack(id);

      return new SuccessResponse({
        message: PROFILES_RETRIEVED_MESSAGE,
        data: profiles,
      });
    } catch (error) {
      this.logger.error(`Error occurred: ${error}`);

      throw new InternalServerErrorException();
    }
  }
}
