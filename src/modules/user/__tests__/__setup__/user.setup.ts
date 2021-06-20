import { Response } from 'supertest';
import {
  testApp,
  post,
  mailer,
} from '../../../../shared/__tests__/__setup__/setup';
import config from '../../../../config';
import { LoginUserDto } from '../../application/user.login.service';
import { RegisterUserDto } from '../../application/user.register.service';
import user from '../__fixtures__/user.fixtures';
import userRepository from '../../infrastructure/persistence';
import { registerUserService } from '../../application';
import { parseLink } from '../../../../shared/utils/helpers';
import DbConnection from '../../../../shared/persistence';

const { baseUrl } = config.web.http;
export const basePath = `${baseUrl}/v1/auth`;
export const storage = 'users';

export const register = `${basePath}/register`;
export const login = `${basePath}/login`;
export const userVerificationEndpoint = `${basePath}/verify`;

export const registerUser = async (data: RegisterUserDto): Promise<Response> =>
  post(register, undefined, data);

export const loginUser = async (data: LoginUserDto): Promise<Response> =>
  post(login, undefined, data);

export const verifyUser = async (token: string): Promise<Response> =>
  testApp.get(`${userVerificationEndpoint}/${token}`);

export const registerAndVerifyUser = async (): Promise<void> => {
  const newUser = user();
  await registerUser(newUser);
  return new Promise((resolve) =>
    setTimeout(async () => {
      const { html } = await mailer.latestTo(newUser.email);
      const matches = parseLink(html);
      if (matches) await testApp.get(matches[1]);
      resolve();
    }, 200),
  );
};

export const dropTestUserStorage = async (): Promise<any> => {
  await DbConnection.dropStorage(storage);
};

export const createUser = async (newUser: RegisterUserDto = user()) => {
  const service = registerUserService();
  const result = await service.handle(newUser);
  // eslint-disable-next-line no-underscore-dangle
  const id = result.data._id;
  await userRepository().updateById(id, {
    emailVerifiedAt: new Date().toISOString(),
  });
  return id;
};
