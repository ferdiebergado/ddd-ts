import { IRequest, IServerResponse } from '.'

export interface IController {
  dispatch(
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => Promise<any> | any
  ): Promise<IServerResponse | void> | IServerResponse | void
}
