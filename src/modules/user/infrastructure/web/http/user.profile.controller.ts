import { AppError, Errors, HttpCodes } from '../../../../../shared/error'
import {
  IController,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
} from '../../../../../shared/web/http'
import {
  UserProfile,
  UserProfileService,
} from '../../../application/user.profile.service'

export class UserProfileController implements IController {
  constructor(private readonly _userProfileService: UserProfileService) {}

  dispatch = async (
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => any
  ): Promise<void | IServerResponse> => {
    try {
      const result = await this._userProfileService.handle(req.params.id)
      if (!result.success)
        throw new AppError(
          Errors.RESOURCE_NOT_FOUND,
          HttpCodes.NOT_FOUND,
          result.message,
          true
        )
      const response: IServerResponsePayload<UserProfile> = {
        status: 'ok',
        message: result.message,
        data: result.data,
      }
      res.json(response)
    } catch (e) {
      next(e)
    }
  }
}
