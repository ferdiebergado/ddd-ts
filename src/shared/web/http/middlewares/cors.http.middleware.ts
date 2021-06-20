import { IRequest, IServerResponse } from '..';
import config from '../../../../config';

const { origin, methods, headers } = config.web.http.cors;

export default (req: IRequest, res: IServerResponse, next: () => any): void => {
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (req.method && req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', methods);
    res.setHeader('Access-Control-Allow-Headers', headers);
    res.statusCode = 204;
    return res.end();
  }
  return next();
};
