/**
 * Defines the base shape of validation error response type.
 *
 * @usageNotes
 * The Base Validation Error Response contains attribute:
 * - `property`: The property which is fail to validate, if the property is array, it will return the index instead
 * - `constraints`: The constraint(s) of property which is fail to validate
 */
export interface ValidationErrors {
  property: string | number;
  constraints: string[] | ValidationErrors[];
}
