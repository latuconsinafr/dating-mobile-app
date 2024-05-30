import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IsSubscriptionExist } from '../../validators/is-subscription-exist.validator';
import { subscriptionData } from '../../../../database/data/subscription.data';
import { SUBSCRIPTION_ID_DESCRIPTION } from '../../constants';

/**
 * Defines the DTO that carries the subscription identifier request parameter.
 */
export class SubscriptionIdParam {
  @IsNotEmpty()
  @IsUUID('4')
  @IsSubscriptionExist()
  @ApiProperty({
    description: SUBSCRIPTION_ID_DESCRIPTION,
    format: 'uuid',
    example: subscriptionData[0].id,
  })
  id: string;
}
