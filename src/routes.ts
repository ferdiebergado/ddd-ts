import config from './config';
import authRouter from './modules/user/infrastructure/web/http/auth.routes';
import userRouter from './modules/user/infrastructure/web/http/user.routes';
import { IRouteGroup } from './shared/web/http';

const { baseUrl } = config.web.http;

const routes: IRouteGroup[] = [
  { path: `${baseUrl}/v1/auth`, router: authRouter },
  { path: `${baseUrl}/v1/users`, router: userRouter },
];

export default routes;
