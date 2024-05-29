import { UnprocessableEntityException } from '../../exceptions/unprocessable-entity.exception';

/**
 * Defines transformer to transform incoming value (most of the incoming value is string),
 * to its respective number type, (ex: '1' are transformer into `1`).
 *
 * @usageNotes
 * This function could also transform incoming value,
 * to its respective float type (ex: '1.25' are transformed into `1.25`) by marking the isFloat flag to true.
 *
 * @example
 * ```ts
 * ...
 * `@IsNotEmpty()`
 * `@IsNumber()`
 * `@Transform(({ value }) => toNumber(value))`
 * LOGGER_BUFFER: number;
 * ...
 * ```
 *
 * @param value The incoming value
 * @param isFloat The flag indicates whether to parse the value as float instead of number or not
 *
 * @returns The number-ed value.
 */
export function toNumber(value: unknown, isFloat = false): number {
  const result = isFloat
    ? parseFloat(value as any)
    : parseInt(value as any, 10);

  if (isNaN(result)) {
    throw new UnprocessableEntityException({
      message: isFloat
        ? 'Unable to parse value to float'
        : 'Unable to parse value to number',
    });
  }

  return result;
}
