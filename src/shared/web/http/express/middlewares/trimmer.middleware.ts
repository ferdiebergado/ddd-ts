import { NextFunction, Request, Response } from 'express'
import { trimmer } from '../../middlewares'

export default (req: Request, res: Response, next: NextFunction): void => {
  trimmer(req, res)
  next()
}
