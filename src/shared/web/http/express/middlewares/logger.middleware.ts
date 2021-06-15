import { Request, Response, NextFunction } from 'express'
import { logger } from '../../middlewares'

export default (req: Request, res: Response, next: NextFunction): void => {
  logger(req, res)
  next()
}
