import { RequestListener } from 'http'
import './shared/utils/env'
import expressApplication from './shared/web/http/express/express.application'
import { IRouteGroup } from './shared/web/http'
import routes from './routes'

export interface IRequestListener {
  bootstrap(): this | void
  addRoute(route: IRouteGroup): this | void
  start(): RequestListener
}

export class Application {
  constructor(
    private readonly _requestListener: IRequestListener,
    routes: IRouteGroup[]
  ) {
    this._requestListener.bootstrap()
    this._addRoutes(routes)
  }

  getRequestListener(): RequestListener {
    return this._requestListener.start()
  }

  private _addRoutes(routes: IRouteGroup[]): void {
    routes.forEach((route) => {
      this._requestListener.addRoute(route)
    })
  }
}

const app = new Application(expressApplication, routes)

export default app.getRequestListener()
