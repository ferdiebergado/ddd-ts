import { IServerResponse, IRequest } from '..';
import { trimStringsFromObj } from '../../../utils/helpers';

export default (req: IRequest, res: IServerResponse): void => {
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  if (methodsWithBody.indexOf(req.method as string) > -1) {
    const { body } = req;
    if (body) {
      res.locals = { body: trimStringsFromObj(body) };
    }
  }
};
