import { HttpMiddleware, router } from '../../../../../shared/web/http';
import { userProfileController } from '.';

const userRouter = router();

userRouter.addRoute(
  'get',
  '/:id',
  userProfileController.dispatch as HttpMiddleware,
);

export default userRouter;
