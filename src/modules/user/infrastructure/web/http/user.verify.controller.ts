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
      const result = await this.verifyUserService.handle(req.params.token);
      if (result.success) {
        const response: IServerResponsePayload<void> = {
          status: 'ok',
          message: result.message,
        };
        res.json(response);
      } else {
        throw new AppError(
          Errors.RESOURCE_NOT_FOUND,
          HttpCodes.NOT_FOUND,
          result.message,
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
