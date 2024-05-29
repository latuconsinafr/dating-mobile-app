import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { SwipeType } from '../../enums/swipe-type.enum';
import { swipeData } from '../../../../database/data/swipe.data';
import { IsUserExist } from '../../../users/validators/is-user-exist.validator';
import { USER_ID_DESCRIPTION } from '../../../users/constants';
import { PROFILE_ID_DESCRIPTION } from '../../../profiles/constants';
import { User } from '../../../users/entities/user.entity';
import { Swipe } from '../../entities/swipe.entity';

/**
 * Defines the DTO that carries data to create a swipe.
 *
 * @usageNotes
 * The CreateProfileRequest contains swipe attribute:
 * - `type`: The type of the swipe
 * - `userId`: The user id who swipe
 * - `profileId`: The profile id who's swiped
 */
export class CreateSwipeRequest {
  @IsNotEmpty()
  @IsEnum(SwipeType)
  @ApiProperty({
    enum: SwipeType,
    description: 'The type of the swipe',
    example: swipeData[0].type,
  })
  type: SwipeType;

  @IsNotEmpty()
  @IsUUID('4')
  @IsUserExist()
  @ApiProperty({
    description: USER_ID_DESCRIPTION,
    format: 'uuid',
    example: swipeData[0].userId,
  })
  userId: string;

  @IsNotEmpty()
  @IsUUID('4')
  @IsUserExist()
  @ApiProperty({
    description: PROFILE_ID_DESCRIPTION,
    format: 'uuid',
    example: swipeData[0].profileId,
  })
  profileId: string;

  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link Swipe} entity
   */
  static toEntity(request: CreateSwipeRequest, requestedBy?: User): Swipe {
    return new Swipe({
      ...request,
      createdById: requestedBy?.id,
      updatedById: requestedBy?.id,
    });
  }
}
