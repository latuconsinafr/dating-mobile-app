import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isUUID,
  registerDecorator,
} from 'class-validator';
import { SubscriptionsService } from '../subscriptions.service';
import { SUBSCRIPTION_DOES_NOT_EXIST_DEFAULT_MESSAGE } from '../constants';

/**
 * Defines the IsSubscriptionExist validator constraint.
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsSubscriptionExistValidator
  implements ValidatorConstraintInterface
{
  /**
   * The constructor.
   *
   * @param subscriptionsService The subscriptions service
   */
  constructor(private subscriptionsService: SubscriptionsService) {}

  /**
   * Validates the subscription existence by its identifier.
   *
   * @param value The identifier to validate
   *
   * @returns The flag indicates whether the given subscription by its related identifier already exists or not.
   */
  async validate(value: string): Promise<boolean> {
    if (isUUID(value, '4')) {
      return await this.subscriptionsService
        .findById(value)
        .then((subscription) => {
          if (subscription) return true;
          return false;
        });
    }

    return false;
  }

  /**
   * {@inheritDoc ValidatorConstraintInterface.defaultMessage}
   */
  defaultMessage(validationArguments?: ValidationArguments): string {
    return SUBSCRIPTION_DOES_NOT_EXIST_DEFAULT_MESSAGE(
      validationArguments?.property,
      validationArguments?.value,
    );
  }
}

/**
 * IsSubscriptionExist decorator.
 *
 * @example
 * `@IsSubscriptionExist()`
 *
 * @param validationOptions The additional validation options
 *
 * @returns custom IsSubscriptionExist validation decorator
 */
export function IsSubscriptionExist(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSubscriptionExistValidator,
    });
  };
}
