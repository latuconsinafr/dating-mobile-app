import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isUUID,
  registerDecorator,
} from 'class-validator';
import { UsersService } from '../users.service';
import { USER_DOES_NOT_EXIST_DEFAULT_MESSAGE } from '../constants';

/**
 * Defines the IsUserExist validator constraint.
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserExistValidator implements ValidatorConstraintInterface {
  /**
   * The constructor.
   *
   * @param usersService The users service
   */
  constructor(private usersService: UsersService) {}

  /**
   * Validates the user existence by its identifier.
   *
   * @param value The identifier to validate
   *
   * @returns The flag indicates whether the given user by its related identifier already exists or not.
   */
  async validate(value: string): Promise<boolean> {
    if (isUUID(value, '4')) {
      return await this.usersService.findById(value).then((user) => {
        if (user) return true;
        return false;
      });
    }

    return false;
  }

  /**
   * {@inheritDoc ValidatorConstraintInterface.defaultMessage}
   */
  defaultMessage(validationArguments?: ValidationArguments): string {
    return USER_DOES_NOT_EXIST_DEFAULT_MESSAGE(
      validationArguments?.property,
      validationArguments?.value,
    );
  }
}

/**
 * IsUserExist decorator.
 *
 * @example
 * `@IsUserExist()`
 *
 * @param validationOptions The additional validation options
 *
 * @returns custom IsUserExist validation decorator
 */
export function IsUserExist(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserExistValidator,
    });
  };
}
