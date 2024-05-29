import { IsNotEmpty, IsUUID } from 'class-validator';
import { SWIPE_ID_DESCRIPTION } from '../../constants';
import { swipeData } from '../../../../database/data/swipe.data';
import { ApiProperty } from '@nestjs/swagger';
import { IsSwipeExist } from '../../validators/is-swipe-exist.validator';

/**
 * Defines the DTO that carries the user identifier request parameter.
 */
export class SwipeIdParam {
  @IsNotEmpty()
  @IsUUID('4')
  @IsSwipeExist()
  @ApiProperty({
    description: SWIPE_ID_DESCRIPTION,
    format: 'uuid',
    example: swipeData[0].id,
  })
  id: string;
}
