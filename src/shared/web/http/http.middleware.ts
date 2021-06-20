import { IRequest } from './http.request.interface';
import { IServerResponse } from './http.response.interface';

export type HttpMiddleware = (
  req: IRequest,
  res: IServerResponse,
  next?: (...args: any[]) => Promise<any> | any,
) => Promise<IServerResponse | void> | IServerResponse | void;
