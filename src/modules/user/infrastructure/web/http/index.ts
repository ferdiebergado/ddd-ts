import {
  registerUserService,
  loginUserService,
  verifyUserService,
  userProfileService,
} from '../../../application';
import RegisterUserController from './user.register.controller';
import LoginUserController from './user.login.controller';
import VerifyUserController from './user.verify.controller';
import UserProfileController from './user.profile.controller';

const registerUserController = new RegisterUserController(
  registerUserService(),
);
const loginUserController = new LoginUserController(loginUserService());
const verifyUserController = new VerifyUserController(verifyUserService());
const userProfileController = new UserProfileController(userProfileService());

export {
  registerUserController,
  loginUserController,
  verifyUserController,
  userProfileController,
};
