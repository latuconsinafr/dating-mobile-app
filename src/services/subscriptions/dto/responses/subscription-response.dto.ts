import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { SubscriptionIdParam } from '../params/subscription-id-param.dto';
import { AuditTrailResponse } from '../../../../common/dto/responses/audit-trail-response.dto';
import { subscriptionData } from '../../../../database/data/subscription.data';

/**
 * Defines the DTO that carries data representing a subscription.
 *
 * @usageNotes
 * The DTO intersect {@link SubscriptionIdParam} with {@link AuditTrailResponse}.
 *
 * The SubscriptionResponse also contains subscription attribute:
 * - `type`: The type of the subscription
 * - `startDate`: The start date of the subscription
 * - `endDate`: The end date of the subscription
 * - `userId`: The user id whos made the subscription
 */
export class SubscriptionResponse extends IntersectionType(
  SubscriptionIdParam,
  AuditTrailResponse,
) {
  @ApiProperty({
    description: 'The type of the subscription',
    example: subscriptionData[0].type,
  })
  type: string;

  @ApiProperty({
    description: 'The start date of the subscription',
    example: subscriptionData[0].startDate,
  })
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the subscription',
    example: subscriptionData[0].endDate,
  })
  endDate: Date;

  @ApiProperty({
    description: 'The user id whos made the subscription',
    example: subscriptionData[0].userId,
  })
  userId: string;
}
