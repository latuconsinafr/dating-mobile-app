import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { SwipeIdParam } from '../params/swipe-id.param.dto';
import { AuditTrailResponse } from '../../../../common/dto/responses/audit-trail-response.dto';
import { SwipeType } from '../../enums/swipe-type.enum';
import { swipeData } from '../../../../database/data/swipe.data';

/**
 * Defines the DTO that carries data representing a swipe.
 *
 * @usageNotes
 * The DTO intersect {@link SwipeIdParam} with {@link AuditTrailResponse}.
 *
 * The SwipeResponse also contains swipe attribute:
 * - `type`: The type of the swipe
 * - `userId`: The user id who swipe
 * - `profileId`: The profile id who's swiped
 */
export class SwipeResponse extends IntersectionType(
  SwipeIdParam,
  AuditTrailResponse,
) {
  @ApiProperty({
    enum: SwipeType,
    description: 'The type of the swipe',
    example: swipeData[0].type,
  })
  type: SwipeType;

  @ApiProperty({
    description: 'The user id who swipe',
    example: swipeData[0].userId,
  })
  userId: string;

  @ApiProperty({
    description: 'The profile id who`s swiped',
    example: swipeData[0].profileId,
  })
  profileId: string;
}
