import { ExpressRouter } from './express/express.router'
import { IController } from './http.controller.interface'
import { HttpMiddleware } from './http.middleware'
import { IRequest } from './http.request.interface'
import {
  IServerResponse,
  IServerResponsePayload,
} from './http.response.interface'
import { IRouteGroup } from './http.router.interface'

const router = new ExpressRouter()

export {
  IController,
  HttpMiddleware,
  IRequest,
  IServerResponse,
  IServerResponsePayload,
  IRouteGroup,
  router,
}
