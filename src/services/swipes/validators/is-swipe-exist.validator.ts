import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isUUID,
  registerDecorator,
} from 'class-validator';
import { SwipesService } from '../swipes.service';
import { SWIPE_DOES_NOT_EXIST_DEFAULT_MESSAGE } from '../constants';

/**
 * Defines the IsSwipeExist validator constraint.
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsSwipeExistValidator implements ValidatorConstraintInterface {
  /**
   * The constructor.
   *
   * @param swipesService The swipes service
   */
  constructor(private swipesService: SwipesService) {}

  /**
   * Validates the swipe existence by its identifier.
   *
   * @param value The identifier to validate
   *
   * @returns The flag indicates whether the given swipe by its related identifier already exists or not.
   */
  async validate(value: string): Promise<boolean> {
    if (isUUID(value, '4')) {
      return await this.swipesService.findById(value).then((swipe) => {
        if (swipe) return true;
        return false;
      });
    }

    return false;
  }

  /**
   * {@inheritDoc ValidatorConstraintInterface.defaultMessage}
   */
  defaultMessage(validationArguments?: ValidationArguments): string {
    return SWIPE_DOES_NOT_EXIST_DEFAULT_MESSAGE(
      validationArguments?.property,
      validationArguments?.value,
    );
  }
}

/**
 * IsSwipeExist decorator.
 *
 * @example
 * `@IsSwipeExist()`
 *
 * @param validationOptions The additional validation options
 *
 * @returns custom IsSwipeExist validation decorator
 */
export function IsSwipeExist(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSwipeExistValidator,
    });
  };
}
