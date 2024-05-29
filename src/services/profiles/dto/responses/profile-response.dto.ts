import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { ProfileIdParam } from '../params/profile-id.param.dto';
import { AuditTrailResponse } from '../../../../common/dto/responses/audit-trail-response.dto';
import { profileData } from '../../../../database/data/profile.data';

/**
 * Defines the DTO that carries data representing a profile.
 *
 * @usageNotes
 * The DTO intersect {@link ProfileIdParam} with {@link AuditTrailResponse}.
 *
 * The ProfileResponse also contains profile attribute:
 * - `name`: The name of the profile
 * - `age`: The age of the profile
 * - `location`: The location of the profile
 * - `aboutMe`: The about me of the profile, if any
 */
export class ProfileResponse extends IntersectionType(
  ProfileIdParam,
  AuditTrailResponse,
) {
  @ApiProperty({
    description: 'The name of the profile',
    example: profileData[1].name,
  })
  name: string;

  @ApiProperty({
    description: 'The age of the profile',
    example: profileData[1].age,
  })
  age: number;

  @ApiProperty({
    description: 'The location of the profile',
    example: profileData[1].location,
  })
  location: string;

  @ApiPropertyOptional({
    description: 'The about me of the profile',
    example: profileData[1].aboutMe,
  })
  aboutMe?: string;
}
