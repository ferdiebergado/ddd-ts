import { ServerResponse } from 'http';

export interface IServerResponse extends ServerResponse {
  statusCode: number;
  json: (payload: any) => void;
  locals: any;
}

export interface IServerResponsePayload<T> {
  status: 'ok' | 'failed';
  message: string;
  data?: T;
}
