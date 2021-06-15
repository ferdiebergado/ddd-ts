import { Request, Response, NextFunction } from 'express'
import { cors } from '../../middlewares'

export default (req: Request, res: Response, next: NextFunction): void => {
  cors(req, res, next)
}
