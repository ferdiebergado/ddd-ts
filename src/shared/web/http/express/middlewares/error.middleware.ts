import { Request, Response, NextFunction } from 'express';
import AppError from '../../../../errors/app.error';
import ErrorHandler from '../../../../errors/error.handler';

export default (
  err: AppError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  const errorHandler = new ErrorHandler(err);
  errorHandler.toHttpResponse(res);
};
