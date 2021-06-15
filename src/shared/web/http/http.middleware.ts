import { IRequest, IServerResponse } from '.'

export type HttpMiddleware = (
  req: IRequest,
  res: IServerResponse,
  next?: (...args: any[]) => Promise<any> | any
) => Promise<IServerResponse | void> | IServerResponse | void
