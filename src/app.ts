import { RequestListener } from 'http';
import './shared/utils/env';
import { IRouteGroup } from './shared/web/http';

export interface IRequestListener {
  bootstrap(): this | void;
  addRoute(route: IRouteGroup): this | void;
  start(): RequestListener;
}

export default class Application {
  constructor(
    private readonly requestListener: IRequestListener,
    routes: IRouteGroup[],
  ) {
    this.requestListener.bootstrap();
    this.addRoutes(routes);
  }

  getRequestListener(): RequestListener {
    return this.requestListener.start();
  }

  private addRoutes(routes: IRouteGroup[]): void {
    routes.forEach((route) => {
      this.requestListener.addRoute(route);
    });
  }
}
