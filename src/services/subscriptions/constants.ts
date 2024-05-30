// * Default description section
/**
 * Defines the subscription id description.
 */
export const SUBSCRIPTION_ID_DESCRIPTION = 'The id of the subscription';

// * Default messages section
/**
 * Defines the message when the subscription has been created.
 */
export const SUBSCRIPTION_CREATED_MESSAGE = 'Subscription created';

/**
 * Defines the message when the subscriptions has been retrieved.
 */
export const SUBSCRIPTIONS_RETRIEVED_MESSAGE = 'Subscriptions retrieved';

/**
 * Defines the message when the subscription has been retrieved.
 */
export const SUBSCRIPTION_RETRIEVED_MESSAGE = 'Subscription retrieved';

/**
 * Defines the message when the subscription has been updated.
 */
export const SUBSCRIPTION_UPDATED_MESSAGE = 'Subscription updated';

/**
 * Defines the message when the subscription has been deleted.
 */
export const SUBSCRIPTION_DELETED_MESSAGE = 'Subscription deleted';

/**
 * Defines the message when the subscription not found.
 */
export const SUBSCRIPTION_NOT_FOUND_MESSAGE = 'Subscription not found';

/**
 * Defines the message when the subscription id is inconsistent.
 */
export const SUBSCRIPTION_INCONSISTENT_ID_MESSAGE =
  'Inconsistent subscription id';

// * Default validation message section
/**
 * Gets default message when validation for the `does not exist` constraint fail.
 */
export const SUBSCRIPTION_DOES_NOT_EXIST_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `subscription with ${property} ${value} doesn't exist`;

/**
 * Gets default message when validation for the `already exists` constraint fail.
 */
export const SUBSCRIPTION_ALREADY_EXISTS_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `subscription with ${property} ${value} already exists`;

// * Default other section
export const SUBSCRIPTION_COUNT = 10;
