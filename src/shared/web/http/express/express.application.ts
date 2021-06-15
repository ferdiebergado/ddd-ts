import express, { Request, Response } from 'express'
import { IApplication } from '../../../../app'
import { notFound, errorHandler, cors, logger } from './middlewares'
import { IRouteGroup } from '../http.router.interface'

class ExpressApplication implements IApplication {
  private readonly _app: express.Application

  constructor() {
    this._app = express()
  }

  bootstrap() {
    this._setOptions()
    this._setupGlobalMiddlewares()
    this._setupRoutes()
  }

  addRoute(route: IRouteGroup): void {
    const { path, router } = route
    this._app.use(path, router.router)
  }

  start() {
    this._setErrorHandlers()
    return this._app
  }

  private _setOptions() {
    this._app.disable('x-powered-by')
    this._app.disable('etag')
  }

  private _setupGlobalMiddlewares() {
    this._app.use(logger)
    this._app.use(express.urlencoded({ extended: false }))
    this._app.use(express.json())
    this._app.use(cors)
  }

  private _setupRoutes() {
    this._app.get('/ping', (_req: Request, res: Response) => {
      res.json({ status: 'ok', version: '0.0.1' })
    })
  }

  private _setErrorHandlers() {
    this._app.use(notFound)
    this._app.use(errorHandler)
  }
}

export default new ExpressApplication()
