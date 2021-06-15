import { router } from '../../../../../shared/web/http'
import { HttpMiddleware } from '../../../../../shared/web/http/http.middleware'
import {
  registerUserController,
  verifyUserController,
  loginUserController,
} from './express/controllers'

router.addRoute(
  'post',
  '/register',
  registerUserController.dispatch as HttpMiddleware
)

router.addRoute(
  'get',
  '/verify/:token',
  verifyUserController.dispatch as HttpMiddleware
)

router.addRoute(
  'post',
  '/login',
  loginUserController.dispatch as HttpMiddleware
)

export default router
