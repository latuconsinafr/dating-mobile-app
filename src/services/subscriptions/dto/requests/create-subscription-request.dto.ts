import { IsEnum, IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { SubscriptionType } from '../../enums/subscription-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { subscriptionData } from '../../../../database/data/subscription.data';
import { IsUserExist } from '../../../users/validators/is-user-exist.validator';
import { USER_ID_DESCRIPTION } from '../../../users/constants';
import { User } from '../../../users/entities/user.entity';
import { Subscription } from '../../entities/subscription.entity';

/**
 * Defines the DTO that carries data to create a subscription.
 *
 * @usageNotes
 * The CreateSubscriptionRequest contains subscription attribute:
 * - `type`: The type of the subscription
 * - `startDate`: The start date of the subscription
 * - `endDate`: The end date of the subscription
 * - `userId`: The user id whos made the subscription
 */
export class CreateSubscriptionRequest {
  @IsNotEmpty()
  @IsEnum(SubscriptionType)
  @ApiProperty({
    enum: SubscriptionType,
    description: 'The type of the subscription',
    example: subscriptionData[0].type,
  })
  type: SubscriptionType;

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({
    description: 'The start date of the subscription',
    example: subscriptionData[0].startDate,
  })
  startDate: Date;

  @IsNotEmpty()
  @IsISO8601()
  @ApiProperty({
    description: 'The end date of the subscription',
    example: subscriptionData[0].endDate,
  })
  endDate: Date;

  @IsNotEmpty()
  @IsUUID('4')
  @IsUserExist()
  @ApiProperty({
    description: USER_ID_DESCRIPTION,
    format: 'uuid',
    example: subscriptionData[0].userId,
  })
  userId: string;

  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link Subscription} entity
   */
  static toEntity(
    request: CreateSubscriptionRequest,
    requestedBy?: User,
  ): Subscription {
    return new Subscription({
      ...request,
      createdById: requestedBy?.id,
      updatedById: requestedBy?.id,
    });
  }
}
