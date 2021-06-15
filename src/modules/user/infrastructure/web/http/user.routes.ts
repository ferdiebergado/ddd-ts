import { HttpMiddleware, router } from '../../../../../shared/web/http'
import { userProfileController } from './express/controllers'

router.addRoute('get', '/:id', userProfileController.dispatch as HttpMiddleware)

export default router
