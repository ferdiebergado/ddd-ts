import { ServerResponse } from 'http'
import { ValidationError, ValidationErrorBag } from './entity'
import { IServerResponsePayload } from './web/http'

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

export class AppError extends Error {
  constructor(
    public readonly name = Errors.SERVER_ERROR,
    public readonly httpCode = HttpCodes.SERVER_ERROR,
    public readonly description = 'Unknown error occurred',
    public readonly isOperational = false,
    public readonly errors?: ValidationError[]
  ) {
    super(description)
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, AppError)
  }
}

export class ErrorHandler {
  constructor(private readonly _error: AppError) {
    this._report()
  }

  private _report() {
    console.error('[ERROR]', this._error)
  }

  toHttpResponse(res: ServerResponse): void {
    const response: IServerResponsePayload<void | ValidationErrorBag> = {
      status: 'failed',
      message: this._error.description,
    }

    if (this._error.errors) {
      response.data = { errors: this._error.errors }
    }

    res.statusCode = this._error.httpCode || 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(response))
  }
}
