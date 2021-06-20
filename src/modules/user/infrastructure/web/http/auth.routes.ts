import { router } from '../../../../../shared/web/http';
import { HttpMiddleware } from '../../../../../shared/web/http/http.middleware';
import {
  registerUserController,
  verifyUserController,
  loginUserController,
} from '.';

const authRouter = router();

authRouter.addRoute(
  'post',
  '/register',
  registerUserController.dispatch as HttpMiddleware,
);

authRouter.addRoute(
  'get',
  '/verify/:token',
  verifyUserController.dispatch as HttpMiddleware,
);

authRouter.addRoute(
  'post',
  '/login',
  loginUserController.dispatch as HttpMiddleware,
);

export default authRouter;
