import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { profileData } from '../../../../database/data/profile.data';
import { Profile } from '../../entities/profile.entity';
import { User } from '../../../users/entities/user.entity';
import { ProfileIdParam } from '../params/profile-id.param.dto';

/**
 * Defines the DTO that carries data to create a profile.
 *
 * @usageNotes
 * The DTO extends the {@link ProfileIdParam} and also contains profile attribute:
 * - `id`: The id of the user
 * - `name`: The name of the profile
 * - `age`: The age of the profile
 * - `location`: The location of the profile
 * - `aboutMe`: The about me of the profile, if any
 */
export class CreateProfileRequest extends ProfileIdParam {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the profile',
    example: profileData[0].name,
  })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The age of the profile',
    example: profileData[0].age,
  })
  age: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The location of the profile',
    example: profileData[0].location,
  })
  location: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'The about me of the profile',
    example: profileData[0].aboutMe,
  })
  aboutMe?: string;

  /**
   * Transform the DTO into the related entity.
   *
   * @param request The request DTO to transform
   * @param requestedBy The request creator, if any
   *
   * @returns The {@link Profile} entity
   */
  static toEntity(request: CreateProfileRequest, requestedBy?: User): Profile {
    return new Profile({
      ...request,
      createdById: requestedBy?.id,
      updatedById: requestedBy?.id,
    });
  }
}
