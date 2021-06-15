import { RegisterUserService } from '../../../../../application/user.register.service'
import { UserLoginService } from '../../../../../application/user.login.service'
import { VerifyUserService } from '../../../../../application/user.verify.service'
import { RegisterUserController } from './user.register.controller'
import { LoginUserController } from './user.login.controller'
import { VerifyUserController } from './user.verify.controller'
import { userRepository } from '../../../../persistence'
import { CryptoHashProvider } from '../../../../../domain/providers/hash.provider'
import { jwtProvider } from '../../../../../../../shared/security'
import { UserProfileController } from '../../user.profile.controller'
import { UserProfileService } from '../../../../../application/user.profile.service'

const hashProvider = new CryptoHashProvider()
const registerUserService = new RegisterUserService(
  userRepository,
  hashProvider
)
const verifyUserService = new VerifyUserService(userRepository, jwtProvider)
const userProfileService = new UserProfileService(userRepository)
const registerUserController = new RegisterUserController(registerUserService)
const loginUserService = new UserLoginService(userRepository, hashProvider)
const loginUserController = new LoginUserController(loginUserService)
const verifyUserController = new VerifyUserController(verifyUserService)
const userProfileController = new UserProfileController(userProfileService)
export {
  registerUserController,
  loginUserController,
  verifyUserController,
  userProfileController,
}
