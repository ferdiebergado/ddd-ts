import { RequestListener } from 'http'
import './shared/utils/env'
import expressApplication from './shared/web/http/express/express.application'
import { RouteGroup } from './shared/web/http/http.router.interface'
import routes from './routes'

export interface IApplication {
  bootstrap(): this | void
  addRoute(route: RouteGroup): this | void
  start(): RequestListener
}

export class Application {
  constructor(private readonly _app: IApplication, routes: RouteGroup[]) {
    this._app.bootstrap()
    this._addRoutes(routes)
  }

  getRequestListener(): RequestListener {
    return this._app.start()
  }

  private _addRoutes(routes: RouteGroup[]): void {
    routes.forEach((route) => {
      this._app.addRoute(route)
    })
  }
}

const app = new Application(expressApplication, routes)

export default app.getRequestListener()