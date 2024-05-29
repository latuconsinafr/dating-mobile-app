import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { USER_ALREADY_EXISTS_DEFAULT_MESSAGE } from '../constants';

/**
 * Defines IsUserEmailUnique validator constraint.
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserEmailUniqueValidator
  implements ValidatorConstraintInterface
{
  /**
   * The constructor.
   *
   * @param usersService The users service
   */
  constructor(private usersService: UsersService) {}

  /**
   * Validates the email uniqueness.
   *
   * @param value The email to validate
   * @param validationArguments The additional validation arguments
   *
   * @returns The flag indicates whether the given email is unique or not.
   */
  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const { constraints, object } = validationArguments || {};
    const [identifierKey] = constraints || [];

    return await this.usersService.findByEmail(value).then((user) => {
      if (!user) {
        return true;
      }

      if (
        identifierKey &&
        object &&
        object[identifierKey as keyof object] ===
          user[identifierKey as keyof User]
      ) {
        return true;
      }

      return false;
    });
  }

  /**
   * {@inheritDoc ValidatorConstraintInterface.defaultMessage}
   */
  defaultMessage(validationArguments?: ValidationArguments): string {
    return USER_ALREADY_EXISTS_DEFAULT_MESSAGE(
      validationArguments?.property,
      validationArguments?.value,
    );
  }
}

/**
 * IsUserEmailUnique decorator.
 *
 * To validate uniqueness against existing value, use the identifierKey to compare the incoming identifier is equal to the existing identifier,
 * if it equals then it would be bypassed.
 *
 * @example
 * `@IsUserEmailUnique()`
 * `@IsUserEmailUnique('id')`
 *
 * @param identifierKey The identifier field, used when the given resources are going to be updated
 * @param validationOptions The additional validation options
 *
 * @returns IsUserEmailUnique decorator
 */
export function IsUserEmailUnique(
  identifierKey?: keyof User,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [identifierKey],
      validator: IsUserEmailUniqueValidator,
    });
  };
}
