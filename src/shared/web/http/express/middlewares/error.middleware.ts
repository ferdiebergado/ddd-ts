import { Request, Response, NextFunction } from 'express'
import { AppError, ErrorHandler } from '../../../../error'

export default (
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const errorHandler = new ErrorHandler(err)
  errorHandler.toHttpResponse(res)
}
