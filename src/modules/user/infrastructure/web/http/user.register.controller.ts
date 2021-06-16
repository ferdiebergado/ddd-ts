import { RegisterUserService } from '../../../application/user.register.service'
import { EntityIdField } from '../../../../../shared/entity'
import { AppError, Errors, HttpCodes } from '../../../../../shared/error'
import {
  IController,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
} from '../../../../../shared/web/http'

export class RegisterUserController implements IController {
  constructor(private readonly _registerUserService: RegisterUserService) {}

  dispatch = async (
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => any
  ): Promise<void> => {
    try {
      const result = await this._registerUserService.handle(req.body)
      if (result.success) {
        const response: IServerResponsePayload<EntityIdField> = {
          status: 'ok',
          message: result.message,
          data: { _id: result.data._id },
        }
        res.statusCode = 201
        res.json(response)
      } else {
        throw new AppError(
          Errors.INVALID_INPUT,
          HttpCodes.INVALID_INPUT,
          result.message,
          true,
          result.data.errors
        )
      }
    } catch (e) {
      next(e)
    }
  }
}
