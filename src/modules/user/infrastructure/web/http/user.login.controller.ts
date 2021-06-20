import {
  IController,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
} from '../../../../../shared/web/http';
import UserLoginService from '../../../application/user.login.service';
import Messages from '../../../../../messages';
import AppError, {
  Errors,
  HttpCodes,
} from '../../../../../shared/errors/app.error';

export default class LoginUserController implements IController {
  constructor(private readonly userLoginService: UserLoginService) {}

  dispatch = async (
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => any,
  ): Promise<void> => {
    try {
      const result = await this.userLoginService.handle(req.body);
      const { message } = result;

      if (result.success) {
        const response: IServerResponsePayload<void> = {
          status: 'ok',
          message,
        };

        res.statusCode = 200;
        res.json(response);
      } else {
        if (message === Messages.INVALID_INPUT) {
          throw new AppError(
            Errors.INVALID_INPUT,
            HttpCodes.INVALID_INPUT,
            message,
            true,
            result.data?.errors,
          );
        }
        throw new AppError(
          Errors.INVALID_AUTHENTICATION_CREDENTIALS,
          HttpCodes.UNAUTHORIZED,
          message,
          true,
          result.data?.errors,
        );
      }
    } catch (e) {
      next(e);
    }
  };
}
