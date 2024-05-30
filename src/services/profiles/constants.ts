// * Default description section
/**
 * Defines the profile id description.
 */
export const PROFILE_ID_DESCRIPTION = 'The id of the profile';

// * Default messages section
/**
 * Defines the message when the profile has been created.
 */
export const PROFILE_CREATED_MESSAGE = 'Profile created';

/**
 * Defines the message when the profiles has been retrieved.
 */
export const PROFILES_RETRIEVED_MESSAGE = 'Profiles retrieved';

/**
 * Defines the message when the profile has been retrieved.
 */
export const PROFILE_RETRIEVED_MESSAGE = 'Profile retrieved';

/**
 * Defines the message when the profile has been updated.
 */
export const PROFILE_UPDATED_MESSAGE = 'Profile updated';

/**
 * Defines the message when the profile has been deleted.
 */
export const PROFILE_DELETED_MESSAGE = 'Profile deleted';

/**
 * Defines the message when the profile not found.
 */
export const PROFILE_NOT_FOUND_MESSAGE = 'Profile not found';

/**
 * Defines the message when the profile id is inconsistent.
 */
export const PROFILE_INCONSISTENT_ID_MESSAGE = 'Inconsistent profile id';

// * Default validation message section
/**
 * Gets default message when validation for the `does not exist` constraint fail.
 */
export const PROFILE_DOES_NOT_EXIST_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `profile with ${property} ${value} doesn't exist`;

/**
 * Gets default message when validation for the `already exists` constraint fail.
 */
export const PROFILE_ALREADY_EXISTS_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `profile with ${property} ${value} already exists`;

// * Default other section
export const PROFILE_STACK_COUNT = 2;
