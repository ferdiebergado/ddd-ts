import { RequestListener } from 'http'
import { HttpMiddleware } from './http.middleware'

export type RequestHandler = RequestListener | HttpMiddleware
export type RequestHandlers = Array<RequestHandler>

export interface IRoute {
  path: string
  handlers: RequestHandlers
}

export interface IRouteGroup {
  path: string
  router: any
}

export interface IRouter {
  router: any
  addRoute(method: string, path: string, ...handlers: RequestHandlers): void
  addMiddleware(...middlewares: HttpMiddleware[]): void
}
