import { ApiProperty } from '@nestjs/swagger';
import { profileData } from '../../../../database/data/profile.data';
import { UserResponse } from './user-response.dto';
import { ProfileResponse } from '../../../profiles/dto/responses/profile-response.dto';
import { Type } from 'class-transformer';

/**
 * Defines the DTO that carries data representing a user.
 *
 * @usageNotes
 * The DTO extends {@link UserResponse}.
 *
 * The UserDetailResponse also contains user attribute:
 * - `profile`: The profile of the user
 */
export class UserDetailResponse extends UserResponse {
  @Type(() => ProfileResponse)
  @ApiProperty({
    description: 'The profile of the user',
    type: ProfileResponse,
    example: profileData[0],
  })
  profile: ProfileResponse;
}
