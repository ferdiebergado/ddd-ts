import { JsonWebTokenError } from 'jsonwebtoken'
import { VerifyUserService } from '../../../application/user.verify.service'
import {
  IController,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
} from '../../../../../shared/web/http'
import { AppError, Errors, HttpCodes } from '../../../../../shared/error'

export class VerifyUserController implements IController {
  constructor(private readonly _verifyUserService: VerifyUserService) {}

  dispatch = async (
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => any
  ): Promise<void> => {
    try {
      const result = await this._verifyUserService.handle(req.params.token)
      if (result.success) {
        const response: IServerResponsePayload<void> = {
          status: 'ok',
          message: result.message,
        }
        res.json(response)
      } else {
        throw new AppError(
          Errors.RESOURCE_NOT_FOUND,
          HttpCodes.NOT_FOUND,
          result.message,
          true
        )
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next(
          new AppError(
            Errors.RESOURCE_NOT_FOUND,
            HttpCodes.NOT_FOUND,
            error.message,
            true
          )
        )
      } else {
        next(error)
      }
    }
  }
}
