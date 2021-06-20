import {
  IController,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
} from '../../../../../shared/web/http';
import UserProfileService, {
  UserProfile,
} from '../../../application/user.profile.service';
import AppError, {
  Errors,
  HttpCodes,
} from '../../../../../shared/errors/app.error';

export default class UserProfileController implements IController {
  constructor(private readonly userProfileService: UserProfileService) {}

  dispatch = async (
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => any,
  ): Promise<void | IServerResponse> => {
    try {
      const result = await this.userProfileService.handle(req.params.id);
      if (!result.success)
        throw new AppError(
          Errors.RESOURCE_NOT_FOUND,
          HttpCodes.NOT_FOUND,
          result.message,
          true,
        );
      const response: IServerResponsePayload<UserProfile> = {
        status: 'ok',
        message: result.message,
        data: result.data,
      };
      res.json(response);
    } catch (e) {
      next(e);
    }
  };
}
