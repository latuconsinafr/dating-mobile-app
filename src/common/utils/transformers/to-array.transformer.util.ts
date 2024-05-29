/**
 * Defines transformer to transform incoming value,
 * to its respective array type, (ex: '1&2' are transformer into [1,2]).
 *
 * @example
 * ```ts
 * ...
 * `@IsNotEmpty()`
 * `@IsNumber()`
 * `@Transform(({ value }) => toArray(value))`
 * LOGGER_BUFFER: number[];
 * ...
 * ```
 *
 * @param value The incoming value
 *
 * @returns The number-ed value.
 */
export function toArray(value: unknown): unknown | unknown[] {
  if (!Array.isArray(value) && value !== undefined) return [value];

  return value;
}
