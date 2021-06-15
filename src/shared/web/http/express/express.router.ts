import express from 'express'
import { HttpMiddleware } from '../http.middleware'
import { IRouter, RequestHandlers } from '../http.router.interface'

interface IExpressRouter extends express.Router {
  [key: string]: any
}

export class ExpressRouter implements IRouter {
  readonly router: IExpressRouter

  constructor() {
    this.router = express.Router()
  }

  addRoute(method: string, path: string, ...handlers: RequestHandlers): void {
    this.router[method](path, ...handlers)
  }

  addMiddleware(...middlewares: HttpMiddleware[]): void {
    this.router.use(...middlewares)
  }
}
