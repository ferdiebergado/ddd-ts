import RegisterUserService from '../../../application/user.register.service';
import { EntityIdField } from '../../../../../shared/entity';
import AppError, {
  Errors,
  HttpCodes,
} from '../../../../../shared/errors/app.error';
import {
  IController,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
} from '../../../../../shared/web/http';

export default class RegisterUserController implements IController {
  constructor(private readonly registerUserService: RegisterUserService) {}

  dispatch = async (
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => any,
  ): Promise<void> => {
    try {
      const { success, message, data } = await this.registerUserService.handle(
        req.body,
      );
      if (success) {
        const response: IServerResponsePayload<EntityIdField> = {
          status: 'ok',
          message,
          // eslint-disable-next-line no-underscore-dangle
          data: { _id: data._id },
        };
        res.statusCode = 201;
        res.json(response);
      } else {
        throw new AppError(
          Errors.INVALID_INPUT,
          HttpCodes.INVALID_INPUT,
          message,
          true,
          data.errors,
        );
      }
    } catch (e) {
      next(e);
    }
  };
}
