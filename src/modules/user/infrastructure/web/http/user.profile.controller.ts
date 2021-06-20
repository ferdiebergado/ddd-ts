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
      const { success, message, data } = await this.userProfileService.handle(
        req.params.id,
      );
      if (!success)
        throw new AppError(
          Errors.RESOURCE_NOT_FOUND,
          HttpCodes.NOT_FOUND,
          message,
          true,
        );
      const response: IServerResponsePayload<UserProfile> = {
        status: 'ok',
        message,
        data,
      };
      res.json(response);
    } catch (e) {
      next(e);
    }
  };
}
