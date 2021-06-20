import { ValidationError } from '../entity';

export enum Errors {
  INVALID_INPUT = 'INVALID_INPUT',
  INVALID_AUTHENTICATION_CREDENTIALS = 'INVALID_AUTHENTICATION_CREDENTIALS',
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
}

export enum HttpCodes {
  INVALID_INPUT = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export default class AppError extends Error {
  constructor(
    public readonly name = Errors.SERVER_ERROR,
    public readonly httpCode = HttpCodes.SERVER_ERROR,
    public readonly description = 'Unknown error occurred',
    public readonly isOperational = false,
    public readonly errors?: ValidationError[],
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, AppError);
  }
}
