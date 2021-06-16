import { HttpMiddleware, router } from '../../../../../shared/web/http'
import { userProfileController } from '.'

router.addRoute('get', '/:id', userProfileController.dispatch as HttpMiddleware)

export default router
