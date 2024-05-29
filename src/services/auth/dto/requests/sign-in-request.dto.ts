import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Defines the DTO that carries data to sign in a user.
 *
 * @usageNotes
 * The SignInRequest contains sign in attribute attribute:
 * - `username`: The username of user
 * - `password`: The password of user
 */
export class SignInRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The username of the user',
    example: 'user',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}
