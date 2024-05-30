// * Default description section
/**
 * Defines the swipe id description.
 */
export const SWIPE_ID_DESCRIPTION = 'The id of the swipe';

// * Default messages section
/**
 * Defines the message when the swipe has been created.
 */
export const SWIPE_CREATED_MESSAGE = 'Swipe created';

/**
 * Defines the message when the swipes has been retrieved.
 */
export const SWIPES_RETRIEVED_MESSAGE = 'Swipes retrieved';

/**
 * Defines the message when the swipe has been retrieved.
 */
export const SWIPE_RETRIEVED_MESSAGE = 'Swipe retrieved';

/**
 * Defines the message when the swipe has been updated.
 */
export const SWIPE_UPDATED_MESSAGE = 'Swipe updated';

/**
 * Defines the message when the swipe has been deleted.
 */
export const SWIPE_DELETED_MESSAGE = 'Swipe deleted';

/**
 * Defines the message when the swipe not found.
 */
export const SWIPE_NOT_FOUND_MESSAGE = 'Swipe not found';

/**
 * Defines the message when the swipe id is inconsistent.
 */
export const SWIPE_INCONSISTENT_ID_MESSAGE = 'Inconsistent swipe id';

// * Default validation message section
/**
 * Gets default message when validation for the `does not exist` constraint fail.
 */
export const SWIPE_DOES_NOT_EXIST_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `swipe with ${property} ${value} doesn't exist`;

/**
 * Gets default message when validation for the `already exists` constraint fail.
 */
export const SWIPE_ALREADY_EXISTS_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `swipe with ${property} ${value} already exists`;

// * Default other section
export const SWIPE_COUNT = 2;
