import express, { Request, Response } from 'express';
import { IRequestListener } from '../../../../app';
import { notFound, errorHandler, cors, logger } from './middlewares';
import { IRouteGroup } from '..';

class ExpressApplication implements IRequestListener {
  private readonly app: express.Application;

  constructor() {
    this.app = express();
  }

  bootstrap() {
    this.setOptions();
    this.setupGlobalMiddlewares();
    this.setupRoutes();
  }

  addRoute(route: IRouteGroup): void {
    const { path, router } = route;
    this.app.use(path, router.router);
  }

  start() {
    this.setErrorHandlers();
    return this.app;
  }

  private setOptions() {
    this.app.disable('x-powered-by');
    this.app.disable('etag');
  }

  private setupGlobalMiddlewares() {
    this.app.use(logger);
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors);
  }

  private setupRoutes() {
    this.app.get('/ping', (_req: Request, res: Response) => {
      res.json({ status: 'ok', version: '0.0.1' });
    });
  }

  private setErrorHandlers() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }
}

export default new ExpressApplication();
