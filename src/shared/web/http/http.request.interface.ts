import { IncomingMessage } from 'http'

export interface IRequest extends IncomingMessage {
  body: any
  params: any
}
