// * Default description section
/**
 * Defines the user id description.
 */
export const USER_ID_DESCRIPTION = 'The id of the user';

// * Default messages section
/**
 * Defines the message when the user has been created.
 */
export const USER_CREATED_MESSAGE = 'User created';

/**
 * Defines the message when the users has been retrieved.
 */
export const USERS_RETRIEVED_MESSAGE = 'Users retrieved';

/**
 * Defines the message when the user has been retrieved.
 */
export const USER_RETRIEVED_MESSAGE = 'User retrieved';

/**
 * Defines the message when the user has been updated.
 */
export const USER_UPDATED_MESSAGE = 'User updated';

/**
 * Defines the message when the user has been deleted.
 */
export const USER_DELETED_MESSAGE = 'User deleted';

/**
 * Defines the message when the user not found.
 */
export const USER_NOT_FOUND_MESSAGE = 'User not found';

/**
 * Defines the message when the user id is inconsistent.
 */
export const USER_INCONSISTENT_ID_MESSAGE = 'Inconsistent user id';

// * Default validation message section
/**
 * Gets default message when validation for the `does not exist` constraint fail.
 */
export const USER_DOES_NOT_EXIST_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `user with ${property} ${value} doesn't exist`;

/**
 * Gets default message when validation for the `already exists` constraint fail.
 */
export const USER_ALREADY_EXISTS_DEFAULT_MESSAGE = (
  property?: string,
  value?: any,
) => `user with ${property} ${value} already exists`;
