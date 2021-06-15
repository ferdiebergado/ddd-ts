import { Request, Response, NextFunction } from 'express'
import { notFound } from '../../middlewares'

export default (req: Request, res: Response, next: NextFunction): void => {
  notFound(req, res, next)
}
