import { JsonWebTokenError } from 'jsonwebtoken';
import {
  IController,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
} from '../../../../../shared/web/http';
import VerifyUserService from '../../../application/user.verify.service';
import AppError, {
  Errors,
  HttpCodes,
} from '../../../../../shared/errors/app.error';

export default class VerifyUserController implements IController {
  constructor(private readonly verifyUserService: VerifyUserService) {}

  dispatch = async (
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => any,
  ): Promise<void> => {
    try {
      const { success, message } = await this.verifyUserService.handle(
        req.params.token,
      );
      if (success) {
        const response: IServerResponsePayload<void> = {
          status: 'ok',
          message,
        };
        res.json(response);
      } else {
        throw new AppError(
          Errors.RESOURCE_NOT_FOUND,
          HttpCodes.NOT_FOUND,
          message,
          true,
        );
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        next(
          new AppError(
            Errors.RESOURCE_NOT_FOUND,
            HttpCodes.NOT_FOUND,
            error.message,
            true,
          ),
        );
      } else {
        next(error);
      }
    }
  };
}
