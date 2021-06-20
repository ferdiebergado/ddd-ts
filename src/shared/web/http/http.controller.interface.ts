import { IRequest } from './http.request.interface';
import { IServerResponse } from './http.response.interface';

export interface IController {
  dispatch(
    req: IRequest,
    res: IServerResponse,
    next: (...args: any[]) => Promise<any> | any,
  ): Promise<IServerResponse | void> | IServerResponse | void;
}
