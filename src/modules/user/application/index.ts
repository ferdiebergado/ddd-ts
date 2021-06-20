import RegisterUserService from './user.register.service';
import LoginUserService from './user.login.service';
import VerifyUserService from './user.verify.service';
import UserProfileService from './user.profile.service';
import userRepository from '../infrastructure/persistence';
import { hashProvider } from '../domain/providers';
import { jwtProvider } from '../../../shared/security';

export const registerUserService = () =>
  new RegisterUserService(userRepository(), hashProvider());
export const loginUserService = () =>
  new LoginUserService(userRepository(), hashProvider());
export const verifyUserService = () =>
  new VerifyUserService(userRepository(), jwtProvider());
export const userProfileService = () =>
  new UserProfileService(userRepository());
