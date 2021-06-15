import { Request, Response, NextFunction } from 'express'

export type ExpressRequestListener = (
  req: Request,
  res: Response,
  next?: NextFunction
) => Promise<void>

export default (f: ExpressRequestListener) =>
  (req: Request, res: Response, next: NextFunction): void => {
    f(req, res, next).catch(next)
  }
