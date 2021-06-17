import { Response } from 'supertest';
import {
  testApp,
  post,
  mailer,
} from '../../../../shared/__tests__/__setup__/setup';
import config from '../../../../config';
import { LoginUserDto } from '../../application/user.login.service';
import { RegisterUserDto } from '../../application/user.register.service';
import { user } from '../__fixtures__/user.fixtures';
import { parseLink } from '../../../../shared/utils/helpers';
import { dbConnection } from '../../../../shared/persistence';

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
  await registerUser(user);
  return new Promise((resolve) =>
    setTimeout(async () => {
      const { html } = await mailer.latestTo(user.email);
      const matches = parseLink(html);
      if (matches) await testApp.get(matches[1]);
      resolve();
    }, 200),
  );
};

export const dropTestUserStorage = async (): Promise<any> =>
  dbConnection.dropStorage(storage);
