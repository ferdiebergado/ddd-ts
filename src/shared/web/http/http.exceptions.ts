import { ValidationError } from '../../entity'

export class HttpException extends Error {
  constructor(
    public statusCode = 500,
    public message = 'Internal server error'
  ) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}

export class NotFoundHttpException extends HttpException {
  constructor(public message = 'Page not found') {
    super(404, message)
  }
}

export class BadRequestHttpException extends HttpException {
  constructor(
    public message = 'Bad request',
    public errors?: ValidationError[]
  ) {
    super(400, message)
  }
}

export class UnauthorizedHttpException extends HttpException {
  constructor(public message = 'Unauthorized') {
    super(401, message)
  }
}
