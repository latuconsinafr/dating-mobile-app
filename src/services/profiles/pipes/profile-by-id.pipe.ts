import { Injectable, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PinoLogger } from 'nestjs-pino';
import { DEFAULT_INVALID_UUID_MESSAGE } from '../../../common/constants';
import { Profile } from '../entities/profile.entity';
import { ProfilesService } from '../profiles.service';
import { UnprocessableEntityException } from '../../../common/exceptions/unprocessable-entity.exception';
import { NotFoundException } from '../../../common/exceptions/not-found.exception';
import { PROFILE_NOT_FOUND_MESSAGE } from '../constants';

/**
 * Class defining the implementation of a pipe that parse string value
 * and return the promise of profile entity of related identifier value.
 *
 * @usageNotes
 * The transform method will throw {@link UnprocessableEntityException}, if fail to validate the string value.
 *
 * Also the transform method will throw {@link NotFoundException}, if fail to parse the profile entity from the parsed string profile identifier value.
 *
 * @see [Pipes](https://docs.nestjs.com/pipes)
 */
@Injectable()
export class ProfileByIdPipe
  implements PipeTransform<string, Promise<Profile>>
{
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
    this.logger.setContext(ProfileByIdPipe.name);
  }

  /**
   * {@inheritDoc PipeTransform.transform}
   */
  async transform(
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    metadata: ArgumentMetadata,
  ): Promise<Profile> {
    this.logger.info(`Try to call ${ProfileByIdPipe.prototype.transform.name}`);

    if (!isUUID(value, '4')) {
      throw new UnprocessableEntityException({
        message: DEFAULT_INVALID_UUID_MESSAGE,
      });
    }

    const profile = await this.profilesService.findById(value);

    if (profile === null) {
      throw new NotFoundException({
        message: PROFILE_NOT_FOUND_MESSAGE,
      });
    }

    return profile;
  }
}
