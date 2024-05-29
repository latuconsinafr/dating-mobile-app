/**
 * Defines enum for application error code.
 */
export enum ErrorCode {
  // * Error codes related to http status code
  /**
   * Defines code for the unauthorized error exception.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/401 documentation}
   */
  ERROR_UNAUTHORIZED = 'error-unauthorized',

  /**
   * Defines code for the forbidden error exception.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403 documentation}
   */
  ERROR_FORBIDDEN = 'error-forbidden',

  /**
   * Defines code for the resource not found error exception.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404 documentation}
   */
  ERROR_NOT_FOUND = 'error-not-found',

  /**
   * Defines code for the conflict error exception.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/409 documentation}
   */
  ERROR_CONFLICT = 'error-conflict',

  /**
   * Defines code for the unprocessable entity error exception.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/422 documentation}
   */
  ERROR_UNPROCESSABLE_ENTITY = 'error-unprocessable-entity',

  /**
   * Defines code for the internal server error exception.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/500 documentation}
   */
  ERROR_INTERNAL_SERVER_ERROR = 'error-internal-server-error',

  // * Other error codes
  /**
   * Defines the code for input validation error exception.
   */
  ERROR_INPUT_VALIDATION_FAILED = 'error-input-validation-failed',
}
