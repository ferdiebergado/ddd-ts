import { IncomingMessage, ServerResponse } from 'http';
import Messages from '../../../../messages';
import AppError, { Errors, HttpCodes } from '../../../errors/app.error';

export default (
  _req: IncomingMessage,
  _res: ServerResponse,
  next: (...args: any[]) => any,
): void => {
  next(
    new AppError(
      Errors.RESOURCE_NOT_FOUND,
      HttpCodes.NOT_FOUND,
      Messages.RESOURCE_NOT_FOUND,
      true,
    ),
  );
};
